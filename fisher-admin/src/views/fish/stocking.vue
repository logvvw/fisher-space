<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">投放记录</h2>
        <p class="subtitle">记录各钓场的鱼苗投放批次与来源追踪</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增投放
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="stockingList"
      row-key="id"
      :loading="loading"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'venue'">
          <span>{{ record.venue?.name || '-' }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">{{ getStatusLabel(record.status) }}</a-tag>
        </template>
        <template v-if="column.key === 'date'">
          <span>{{ record.date ? record.date.substring(0, 10) : '-' }}</span>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" title="新增投放记录" @ok="handleModalOk" :confirm-loading="modalLoading" class="admin-modal">
      <a-form layout="vertical">
        <a-form-item label="钓场" name="venueId" :rules="[{ required: true, message: '请选择钓场' }]">
          <a-select v-model:value="formState.venueId" placeholder="请选择钓场" show-search :filter-option="(i: string, o: any) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())">
            <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="鱼种" name="fish" :rules="[{ required: true, message: '请选择鱼种' }]">
          <a-select v-model:value="formState.fish" placeholder="请选择鱼种">
            <a-select-option v-for="s in fishSpecies" :key="s" :value="s">{{ s }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="投放数量（尾）" name="amount" :rules="[{ required: true, message: '请输入数量' }]">
          <a-input-number v-model:value="formState.amount" :min="1" style="width: 100%;" placeholder="请输入投放数量" />
        </a-form-item>
        <a-form-item label="投放日期" name="date">
          <a-date-picker v-model:value="formState.date" style="width: 100%;" />
        </a-form-item>
        <a-form-item label="来源供应商" name="supplier">
          <a-input v-model:value="formState.supplier" placeholder="请输入供应商名称（可选）" />
        </a-form-item>
        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="formState.status" placeholder="请选择状态">
            <a-select-option value="pending">待投放</a-select-option>
            <a-select-option value="transit">运输中</a-select-option>
            <a-select-option value="done">已投放</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchVenues, fetchStockingRecords, createStockingRecord } from '@/api';

const loading = ref(false);
const stockingList = ref<any[]>([]);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const fishSpecies = ref(['草鱼', '鲫鱼', '鲤鱼', '青鱼', '鳊鱼', '鲢鳙', '黑鱼', '罗非']);

const columns = [
  { title: '批次号', dataIndex: 'id', key: 'id', width: 100 },
  { title: '钓场', key: 'venue', width: 140 },
  { title: '鱼种', dataIndex: 'fish', key: 'fish', width: 80 },
  { title: '投放数量(尾)', dataIndex: 'amount', key: 'amount', width: 110 },
  { title: '投放日期', key: 'date', width: 120 },
  { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 140 },
  { title: '状态', key: 'status', width: 90 },
];

const getStatusLabel = (s: string) => ({ pending: '待投放', transit: '运输中', done: '已投放' }[s] || s);
const getStatusColor = (s: string) => ({ pending: 'orange', transit: 'blue', done: 'green' }[s] || 'default');

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    venueOptions.value = (res?.list || res || []).map((v: any) => ({ label: v.name, value: v.id }));
  } catch (err) {
    console.error('Failed to load venues', err);
  }
};

const loadStockingRecords = async () => {
  loading.value = true;
  try {
    const res: any = await fetchStockingRecords({ page: 1, limit: 100 });
    stockingList.value = res.list || res || [];
  } catch (err) {
    message.error('加载投放记录失败');
  } finally {
    loading.value = false;
  }
};

const modalVisible = ref(false);
const modalLoading = ref(false);
const formState = reactive({ venueId: undefined as number | undefined, fish: '', amount: 1000, date: null as any, supplier: '', status: 'pending' });

const handleAdd = () => {
  formState.venueId = undefined; 
  formState.fish = ''; 
  formState.amount = 1000; 
  formState.date = null; 
  formState.supplier = ''; 
  formState.status = 'pending';
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    if (!formState.venueId || !formState.fish || !formState.date) { 
      message.error('请填写必填项（包括日期）'); 
      return; 
    }
    modalLoading.value = true;
    
    // Prepare data for API
    const postData = {
      ...formState,
      date: formState.date.toISOString ? formState.date.toISOString() : formState.date,
    };

    await createStockingRecord(postData);
    
    modalVisible.value = false;
    message.success('添加成功');
    loadStockingRecords();
  } catch (err) { 
    message.error('添加失败'); 
  } finally { 
    modalLoading.value = false; 
  }
};

onMounted(async () => { 
  loadVenues();
  loadStockingRecords();
});
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>