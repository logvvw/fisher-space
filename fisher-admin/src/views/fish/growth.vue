<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">生长动态</h2>
        <p class="subtitle">记录各钓场鱼群生长状态与投喂记录</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增记录
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="growthList"
      row-key="id"
      :loading="loading"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'venue'">
          <span>{{ record.venue?.name || '-' }}</span>
        </template>
        <template v-if="column.key === 'growth'">
          <span v-if="record.lastWeight != null" style="color: #52c41a;">
            +{{ (record.currentWeight - record.lastWeight).toFixed(2) }} kg
          </span>
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'recordedAt'">
          <span>{{ record.recordedAt ? record.recordedAt.substring(0, 10) : '-' }}</span>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" title="新增生长记录" @ok="handleModalOk" :confirm-loading="modalLoading" class="admin-modal">
      <a-form layout="vertical">
        <a-form-item label="钓场" name="venueId" :rules="[{ required: true, message: '请选择钓场' }]">
          <a-select v-model:value="formState.venueId" placeholder="请选择钓场" show-search :filter-option="(i: string, o: any) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())">
            <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="鱼种" name="name" :rules="[{ required: true, message: '请选择鱼种' }]">
          <a-select v-model:value="formState.name" placeholder="请选择鱼种">
            <a-select-option v-for="s in fishSpecies" :key="s" :value="s">{{ s }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="当前均重 (kg)" name="currentWeight">
          <a-input-number v-model:value="formState.currentWeight" :min="0" :step="0.1" style="width: 100%;" />
        </a-form-item>
        <a-form-item label="记录时间" name="recordedAt">
          <a-date-picker v-model:value="formState.recordedAt" style="width: 100%;" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchVenues, fetchGrowthRecords, createGrowthRecord } from '@/api';

const loading = ref(false);
const growthList = ref<any[]>([]);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const fishSpecies = ref(['草鱼', '鲫鱼', '鲤鱼', '青鱼', '鳊鱼', '鲢鳙', '黑鱼', '罗非']);

const columns = [
  { title: '鱼种名称', dataIndex: 'name', key: 'name' },
  { title: '钓场', key: 'venue', width: 140 },
  { title: '当前均重(kg)', dataIndex: 'currentWeight', key: 'currentWeight', width: 120 },
  { title: '上次均重(kg)', dataIndex: 'lastWeight', key: 'lastWeight', width: 120 },
  { title: '增长量', key: 'growth', width: 100 },
  { title: '记录时间', key: 'recordedAt', width: 120 },
];

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    venueOptions.value = (res?.list || res || []).map((v: any) => ({ label: v.name, value: v.id }));
  } catch (err) {
    console.error('Failed to load venues', err);
  }
};

const loadGrowthRecords = async () => {
  loading.value = true;
  try {
    const res: any = await fetchGrowthRecords({ page: 1, limit: 100 });
    growthList.value = res.list || res || [];
  } catch (err) {
    message.error('加载生长记录失败');
  } finally {
    loading.value = false;
  }
};

const modalVisible = ref(false);
const modalLoading = ref(false);
const formState = reactive({ venueId: undefined as number | undefined, name: '', currentWeight: 0, recordedAt: null as any });

const handleAdd = () => {
  formState.venueId = undefined; 
  formState.name = ''; 
  formState.currentWeight = 0; 
  formState.recordedAt = null;
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    if (!formState.venueId || !formState.name || !formState.recordedAt) { 
      message.error('请填写必填项（包括时间）'); 
      return; 
    }
    modalLoading.value = true;

    // Prepare data for API
    const postData = {
      ...formState,
      recordedAt: formState.recordedAt.toISOString ? formState.recordedAt.toISOString() : formState.recordedAt,
    };

    await createGrowthRecord(postData);

    modalVisible.value = false;
    message.success('添加成功');
    loadGrowthRecords();
  } catch (err) { 
    message.error('添加失败'); 
  } finally { 
    modalLoading.value = false; 
  }
};

onMounted(async () => { 
  loadVenues();
  loadGrowthRecords();
});
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>