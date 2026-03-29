<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">收费定价</h2>
        <p class="subtitle">管理各钓场的收费方式和价格标准</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增定价
      </a-button>
    </div>

    <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
      <a-select v-model:value="venueFilter" placeholder="筛选钓场" style="width: 200px;" allow-clear @change="loadPricings">
        <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
      </a-select>
      <a-select v-model:value="typeFilter" placeholder="计费方式" style="width: 160px;" allow-clear @change="loadPricings">
        <a-select-option value="per_weight">按斤计费</a-select-option>
        <a-select-option value="per_day">按天计费</a-select-option>
        <a-select-option value="per_hour">按时计费</a-select-option>
        <a-select-option value="membership">会员制</a-select-option>
      </a-select>
    </div>

    <a-table
      :columns="columns"
      :data-source="pricings"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'venue'">
          <span>{{ record.venue?.name || `钓场#${record.venueId}` }}</span>
        </template>
        <template v-else-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">{{ getTypeLabel(record.type) }}</a-tag>
        </template>
        <template v-else-if="column.key === 'price'">
          <span style="color: var(--primary-color); font-weight: bold;">¥{{ parseFloat(record.price) }}</span>
        </template>
        <template v-else-if="column.key === 'description'">
          <span>{{ (record.description || '').length > 30 ? (record.description || '').slice(0, 30) + '...' : record.description }}</span>
        </template>
        <template v-else-if="column.key === 'isActive'">
          <a-tag :color="record.isActive ? 'green' : 'red'">{{ record.isActive ? '启用' : '禁用' }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除该定价？" @confirm="confirmDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑定价' : '新增定价'" @ok="handleModalOk" :confirm-loading="modalLoading" class="admin-modal">
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item label="所属钓场" name="venueId" :rules="[{ required: true, message: '请选择钓场' }]">
          <a-select v-model:value="formState.venueId" placeholder="请选择钓场" show-search :filter-option="(input: string, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())">
            <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="计费方式" name="type" :rules="[{ required: true, message: '请选择计费方式' }]">
          <a-select v-model:value="formState.type" placeholder="请选择计费方式">
            <a-select-option value="per_weight">按斤计费</a-select-option>
            <a-select-option value="per_day">按天计费</a-select-option>
            <a-select-option value="per_hour">按时计费</a-select-option>
            <a-select-option value="membership">会员制</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="价格（元）" name="price" :rules="[{ required: true, message: '请输入价格' }]">
          <a-input-number v-model:value="formState.price" :min="0" :precision="2" style="width: 100%;" placeholder="请输入价格" />
        </a-form-item>
        <a-form-item label="单位" name="unit">
          <a-input v-model:value="formState.unit" placeholder="如：斤/天/小时（可选）" />
        </a-form-item>
        <a-form-item label="说明" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入定价说明（可选）" :rows="2" />
        </a-form-item>
        <a-form-item label="启用状态" name="isActive">
          <a-switch v-model:checked="formState.isActive" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { fetchVenues } from '@/api';

const loading = ref(false);
const pricings = ref<any[]>([]);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const venueFilter = ref<number | null>(null);
const typeFilter = ref('');
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const modalLoading = ref(false);
const isEdit = ref(false);
const formRef = ref();
const editingId = ref<number | null>(null);

const formState = reactive({
  venueId: undefined as number | undefined,
  type: 'per_day',
  price: 0,
  unit: '',
  description: '',
  isActive: true,
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '钓场', key: 'venue', width: 140 },
  { title: '计费方式', key: 'type', width: 110 },
  { title: '价格', key: 'price', width: 90 },
  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
  { title: '说明', key: 'description' },
  { title: '状态', key: 'isActive', width: 80 },
  { title: '操作', key: 'action', width: 150 },
];

const getTypeLabel = (t: string) => ({ per_weight: '按斤计费', per_day: '按天计费', per_hour: '按时计费', membership: '会员制' }[t] || t);
const getTypeColor = (t: string) => ({ per_weight: 'orange', per_day: 'blue', per_hour: 'purple', membership: 'green' }[t] || 'default');

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    venueOptions.value = (res?.list || res || []).map((v: any) => ({ label: v.name, value: v.id }));
  } catch { /* silent */ }
};

const loadPricings = async () => {
  loading.value = true;
  try {
    const res: any = await axios.get('/api/pricings', { params: { page: pagination.current, pageSize: pagination.pageSize, venueId: venueFilter.value, type: typeFilter.value || undefined } });
    pricings.value = res?.data?.items || res?.data?.list || res?.data || [];
    if (res?.data?.total) pagination.total = res.data.total;
  } catch {
    message.error('加载定价列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadPricings();
};

const handleAdd = () => {
  isEdit.value = false;
  editingId.value = null;
  Object.assign(formState, { venueId: undefined, type: 'per_day', price: 0, unit: '', description: '', isActive: true });
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  editingId.value = record.id;
  Object.assign(formState, { venueId: record.venueId, type: record.type, price: parseFloat(record.price), unit: record.unit || '', description: record.description || '', isActive: record.isActive });
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    modalLoading.value = true;
    const payload = { type: formState.type, price: formState.price, unit: formState.unit || undefined, description: formState.description || undefined, isActive: formState.isActive };
    if (isEdit.value && editingId.value != null) {
      await axios.put(`/api/pricings/${editingId.value}`, payload);
      message.success('更新成功');
    } else {
      await axios.post(`/api/pricings/venue/${formState.venueId}`, payload);
      message.success('创建成功');
    }
    modalVisible.value = false;
    loadPricings();
  } catch {
    message.error('操作失败');
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async (id: number) => {
  try {
    await axios.delete(`/api/pricings/${id}`);
    message.success('删除成功');
    loadPricings();
  } catch {
    message.error('删除失败');
  }
};

onMounted(() => { loadVenues(); loadPricings(); });
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>