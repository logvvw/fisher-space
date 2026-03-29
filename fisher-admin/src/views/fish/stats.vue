<template>
  <div class="glass-panel" style="padding: 24px; border-radius: 16px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">鱼类数据统计与分析</h2>
        <p class="subtitle">全盘掌握各钓场水域的鱼种投放动态、品种模型及核心资产分布</p>
      </div>
      <div class="header-actions">
        <a-select 
          v-model:value="selectedVenue" 
          placeholder="全部分支机构/钓场" 
          style="width: 240px;"
          @change="loadStatsData"
          allow-clear
        >
          <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
        </a-select>
        <a-button type="primary" @click="loadStatsData" :loading="loading">
          <template #icon><ReloadOutlined /></template>
          重新分析
        </a-button>
      </div>
    </div>

    <!-- 数据核心卡片看板 -->
    <a-row :gutter="24" style="margin-bottom: 24px;">
      <a-col :span="8">
        <div class="stat-box glass-panel interactive-box" :class="{ 'box-active': currentMetric === 'quantity' }" @click="switchMetric('quantity')">
          <div class="stat-title">总存量资产 (尾)</div>
          <div class="stat-value text-gradient">{{ totalQuantity.toLocaleString() }}</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="stat-box glass-panel interactive-box" :class="{ 'box-active': currentMetric === 'species' }" @click="switchMetric('species')">
          <div class="stat-title">维护品种数 (类)</div>
          <div class="stat-value text-gradient" style="background: linear-gradient(135deg, #00f2fe, #4facfe); -webkit-background-clip: text; background-clip: text;">{{ speciesCount }}</div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="stat-box glass-panel">
          <div class="stat-title">最大单尾均重 (Kg)</div>
          <div class="stat-value text-gradient" style="background: linear-gradient(135deg, #fbc2eb, #a6c1ee); -webkit-background-clip: text; background-clip: text;">{{ maxWeight.toFixed(2) }}</div>
        </div>
      </a-col>
    </a-row>

    <!-- 动态交互大图表矩阵 -->
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card :title="chartTitle" :bordered="false" class="chart-card glass-panel" :headStyle="{ borderBottom: '1px solid var(--glass-border)', fontSize: '18px' }">
          <div ref="dynamicChartRef" style="height: 480px; width: 100%;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 新增：全场馆资产分布饼图（仅在“总存量资产”统计维度且未筛选特定钓场时展示） -->
    <a-row :gutter="24" style="margin-top: 24px;" v-if="selectedVenue === undefined && currentMetric === 'quantity'">
      <a-col :span="24">
        <a-card title="全域资产版图：各钓场存量占比分析" :bordered="false" class="chart-card glass-panel" :headStyle="{ borderBottom: '1px solid var(--glass-border)', fontSize: '18px' }">
          <div ref="venueChartRef" style="height: 400px; width: 100%;"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, onUnmounted, computed, nextTick } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import * as echarts from 'echarts';
import { fetchSpecies, fetchVenues, fetchSpeciesStats } from '@/api';

const loading = ref(false);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const selectedVenue = ref<number | undefined>(undefined);

// 核心统计指标
const totalQuantity = ref(0);
const speciesCount = ref(0);
const maxWeight = ref(0);

// 全局缓存的分类数据
const speciesData = ref<any[]>([]);
const currentMetric = ref<'quantity' | 'species'>('quantity');

// ECharts Refs
const dynamicChartRef = ref<HTMLElement | null>(null);
const venueChartRef = ref<HTMLElement | null>(null);

let dynamicChart: echarts.ECharts | null = null;
let venueChart: echarts.ECharts | null = null;

const chartTitle = computed(() => {
  return currentMetric.value === 'quantity' 
    ? '各品种鱼类存量资产分布 (柱状图)' 
    : '各水域鱼种资产成分占比 (饼形图)';
});

// 1. 初始化钓场筛选项
const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    const list = res.list || res.data || res || [];
    venueOptions.value = list.map((v: any) => ({
      label: v.name,
      value: v.id
    }));
  } catch (err) {
    message.error('加载钓场信息失败');
  }
};

// 2. 拉取全量数据并重绘分析
const loadStatsData = async () => {
  loading.value = true;
  try {
    // 异步并行：拉取全量鱼种列表 (用于柱状图) 与 聚合统计数据 (用于饼图)
    const [speciesRes, statsRes]: any = await Promise.all([
      fetchSpecies({ pageSize: 1000 }),
      selectedVenue.value === undefined ? fetchSpeciesStats() : Promise.resolve({ data: [] })
    ]);
    
    let dataList = speciesRes.list || speciesRes.data || speciesRes || [];
    
    // 如果选了具体钓场则过滤
    if (selectedVenue.value !== undefined) {
      dataList = dataList.filter((item: any) => item.venue?.id === selectedVenue.value || item.venueId === selectedVenue.value);
    }
    
    speciesData.value = dataList;
    processDataMetrics(dataList);
    renderDynamicChart();
    
    // 渲染全场馆分布图（只有在未筛选特定场馆时）
    if (selectedVenue.value === undefined && currentMetric === 'quantity') {
      const statsList = statsRes.data || statsRes || [];
      await nextTick();
      renderVenuePieChart(statsList);
    }
  } catch (err) {
    console.error(err);
    message.error('全量分析模型加载异常');
  } finally {
    loading.value = false;
  }
};

// 3. 计算顶层 KPI
const processDataMetrics = (list: any[]) => {
  speciesCount.value = list.length;
  let q = 0, m = 0;
  list.forEach(item => {
    q += item.quantity || 0;
    const w = parseFloat(item.avgWeight || 0);
    if (w > m) m = w;
  });
  totalQuantity.value = q;
  maxWeight.value = m;
};

// 切换度量模式
const switchMetric = (metric: 'quantity' | 'species') => {
  if (currentMetric.value === metric) return;
  currentMetric.value = metric;
  renderDynamicChart();
  
  if (selectedVenue.value === undefined && metric === 'quantity') {
    // 重新加载全量统计接口
    fetchSpeciesStats().then((res: any) => {
      const statsList = res.data || res || [];
      nextTick(() => renderVenuePieChart(statsList));
    });
  }
};

// 4. 渲染核心动态图表
const renderDynamicChart = () => {
  if (!dynamicChartRef.value) return;
  
  if (!dynamicChart) {
    dynamicChart = echarts.init(dynamicChartRef.value);
  }
  
  dynamicChart.clear();
  const list = speciesData.value;
  
  if (currentMetric.value === 'quantity') {
    // -- 柱状图：各鱼种数量分布 --
    const sorted = [...list].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    const names = sorted.map(i => i.name);
    const quantities = sorted.map(i => i.quantity || 0);
    
    dynamicChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(255,255,255,0.95)' },
      grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#475569', interval: 0, rotate: 30 }
      },
      yAxis: {
        type: 'value',
        name: '存量分布 (尾)',
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
        axisLabel: { color: '#475569' }
      },
      series: [
        {
          name: '存量',
          type: 'bar',
          barWidth: 32,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#6366f1' },
              { offset: 1, color: '#a855f7' }
            ]),
            borderRadius: [8, 8, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            color: '#6366f1',
            fontWeight: 'bold'
          },
          data: quantities
        }
      ]
    });
  } else {
    // -- 饼形图：展示种类占比 --
    const pieData = list.map(i => ({ name: i.name, value: i.quantity || 0 }));
    
    dynamicChart.setOption({
      tooltip: { trigger: 'item', backgroundColor: 'rgba(255,255,255,0.95)', formatter: '{a} <br/>{b} : {c} 尾 ({d}%)' },
      legend: { type: 'scroll', orient: 'vertical', right: '5%', top: 'middle', textStyle: { color: '#64748b' } },
      series: [
        {
          name: '资产种类成分',
          type: 'pie',
          radius: ['35%', '70%'],
          center: ['40%', '50%'],
          roseType: 'radius',
          itemStyle: { borderRadius: 8 },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#475569'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          data: pieData
        }
      ]
    });
  }
};

// 5. 渲染场馆分布饼图 (各钓场存量占比)
const renderVenuePieChart = (statsList: any[]) => {
  if (!venueChartRef.value) return;
  
  if (!venueChart) {
    venueChart = echarts.init(venueChartRef.value);
  }
  
  const pieData = statsList.map((item: any) => ({
    name: item.venueName || '未命名钓场',
    value: parseFloat(item.totalQuantity || 0)
  })).sort((a, b) => b.value - a.value);
  
  venueChart.setOption({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255,255,255,0.95)', formatter: '{a} <br/>{b} : {c} 尾 ({d}%)' },
    legend: { type: 'scroll', orient: 'vertical', left: '10%', top: 'middle', textStyle: { color: '#64748b' } },
    color: ['#00f2fe', '#4facfe', '#7117ea', '#ea6060', '#fbc2eb', '#a6c1ee', '#89f7fe', '#66a6ff'],
    series: [
      {
        name: '钓场存量权属',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        roseType: 'radius',
        itemStyle: { borderRadius: 12, borderColor: 'transparent', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 13, color: '#475569' },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 15, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' }
        },
        data: pieData
      }
    ]
  });
};

const handleResize = () => {
  dynamicChart?.resize();
  venueChart?.resize();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  loadVenues().then(() => {
    loadStatsData();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  dynamicChart?.dispose();
  venueChart?.dispose();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.subtitle {
  color: var(--text-dim);
  font-size: 14px;
  margin-top: 4px;
}

.stat-box {
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.interactive-box {
  cursor: pointer;
  border: 1px solid transparent;
}

.interactive-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
}

.box-active {
  border-color: #6366f1;
  background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(99,102,241,0.05) 100%);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.1);
}

.stat-title {
  color: var(--text-dim);
  font-size: 15px;
  margin-bottom: 12px;
  font-weight: 500;
}

.stat-value {
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.chart-card {
  border-radius: 12px;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
  color: var(--text-bright);
}
</style>
