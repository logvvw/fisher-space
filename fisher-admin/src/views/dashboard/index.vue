<template>
  <div class="dashboard-page">
    <div class="welcome-banner">
      <h1 class="text-gradient">欢迎回来，Administrator</h1>
      <p>今天是 {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}，这里是钓场门户的实时概览。</p>
    </div>

    <!-- Quick Stats Grid -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.title">
        <div class="stat-card glass-panel">
          <div class="stat-icon" :style="{ background: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div class="stat-main">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% 较昨日
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Detailed Sections -->
    <a-row :gutter="24" style="margin-top: 24px">
      <a-col :span="16">
        <a-card title="经营趋势" class="chart-card">
          <div class="placeholder-chart">
            <!-- 实际项目中应使用 ECharts 或类似库 -->
            <div class="chart-bar-container">
              <div v-for="h in [40, 60, 45, 80, 55, 90, 70]" :key="h" class="chart-bar" :style="{ height: h + '%' }"></div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="待办任务" class="todo-card">
          <a-list :data-source="todos" size="small">
            <template #renderItem="{ item }">
              <a-list-item class="todo-item">
                <a-checkbox>{{ item.text }}</a-checkbox>
                <a-tag :color="item.priority === 'high' ? 'error' : 'processing'">{{ item.tag }}</a-tag>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserOutlined, ShopOutlined, TransactionOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { fetchUsers, fetchVenues, fetchFishInfos } from '@/api';

const stats = ref([
  { title: '总活跃用户', value: '-', trend: 0, icon: UserOutlined, color: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' },
  { title: '入驻钓场', value: '-', trend: 0, icon: ShopOutlined, color: 'linear-gradient(135deg, #7117ea 0%, #ea6060 100%)' },
  { title: '待审钓场', value: '-', trend: 0, icon: TransactionOutlined, color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: '鱼讯总数', value: '-', trend: 0, icon: MessageOutlined, color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
]);

const todos = [
  { text: '审核"碧波湖"钓场资料', priority: 'high', tag: '紧急' },
  { text: '回复用户关于春季赛的咨询', priority: 'medium', tag: '待办' },
  { text: '确认 4 月份首页 Banner 排期', priority: 'medium', tag: '待办' },
  { text: '更新鱼肉分类百科词条', priority: 'low', tag: '次要' },
];

onMounted(async () => {
  try {
    const [usersRes, venuesRes, fishRes, pendingRes] = await Promise.all([
      fetchUsers({ pageSize: 1 }),
      fetchVenues({ pageSize: 1 }),
      fetchFishInfos({ pageSize: 1 }),
      fetchVenues({ status: 'pending', pageSize: 1 }),
    ]);
    const totalUsers = usersRes?.total ?? 0;
    const totalVenues = venuesRes?.total ?? 0;
    const totalFish = fishRes?.total ?? (Array.isArray(fishRes) ? fishRes.length : 0);
    const pendingVenues = pendingRes?.total ?? 0;
    stats.value = [
      { title: '总活跃用户', value: totalUsers.toLocaleString(), trend: 0, icon: UserOutlined, color: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' },
      { title: '入驻钓场', value: totalVenues.toLocaleString(), trend: 0, icon: ShopOutlined, color: 'linear-gradient(135deg, #7117ea 0%, #ea6060 100%)' },
      { title: '待审钓场', value: pendingVenues.toLocaleString(), trend: 0, icon: TransactionOutlined, color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
      { title: '鱼讯总数', value: totalFish.toLocaleString(), trend: 0, icon: MessageOutlined, color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    ];
  } catch { /* silent */ }
});
</script>

<style scoped>
.welcome-banner {
  margin-bottom: 32px;
}

.welcome-banner h1 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.welcome-banner p {
  color: var(--text-dim);
  font-size: 14px;
}

.text-gradient {
  background: linear-gradient(135deg, #fff 0%, var(--admin-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  gap: 16px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stat-title {
  font-size: 14px;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
}

.stat-trend.up { color: #52c41a; }
.stat-trend.down { color: #f5222d; }

.chart-card {
  min-height: 400px;
}

.placeholder-chart {
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.chart-bar-container {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 100%;
  width: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, var(--admin-primary), transparent);
  border-radius: 4px 4px 0 0;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.chart-bar:hover {
  opacity: 1;
}

.todo-item {
  border-bottom: 1px solid var(--glass-border) !important;
  padding: 12px 0 !important;
}

.todo-item :deep(.ant-checkbox-wrapper) {
  color: #eee !important;
}
</style>