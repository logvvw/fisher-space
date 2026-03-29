<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">品种维护</h2>
        <p class="subtitle">管理钓场的鱼类品种，记录均重和当前存量</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增品种
      </a-button>
    </div>

    <!-- 搜索与表格 -->
    <div style="margin-bottom: 16px; max-width: 400px;">
      <a-input-search 
        v-model:value="searchQuery" 
        placeholder="搜索鱼种名称..." 
        enter-button 
        @search="onSearch"
      />
    </div>

    <a-table 
      :columns="columns" 
      :data-source="speciesList" 
      row-key="id" 
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'venue'">
          <a-tag color="blue" v-if="record.venue">{{ record.venue.name }}</a-tag>
          <span v-else class="text-dim">未绑定</span>
        </template>
        <template v-if="column.key === 'category'">
          <a-tag :color="record.category === 'saltwater' ? 'cyan' : 'green'">
            {{ record.category === 'saltwater' ? '海水鱼' : '淡水鱼' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'avgWeight'">
          <span>{{ record.avgWeight ? `${parseFloat(record.avgWeight)} kg` : '未知' }}</span>
        </template>
        <template v-if="column.key === 'quantity'">
          <span>{{ record.quantity }} 尾</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除该品种吗？相关数据将不可恢复" @confirm="confirmDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal for Add/Edit -->
    <a-modal 
      v-model:open="modalVisible" 
      :title="isEdit ? '编辑鱼种' : '新增鱼种'" 
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
      class="admin-modal"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item 
          label="所属钓场" 
          name="venueId" 
          :rules="[{ required: true, message: '请选择关联的钓场' }]"
        >
          <a-select 
            v-model:value="formState.venueId" 
            placeholder="请选择已审核通过的钓场"
            show-search
            :filter-option="(input: string, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())"
            :options="venueOptions"
          ></a-select>
        </a-form-item>

        <a-form-item 
          label="品种名称" 
          name="name" 
          :rules="[{ required: true, message: '请输入鱼类名称（如：草鱼、青鱼）' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入品种名称" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="水域类型" name="category">
              <a-radio-group v-model:value="formState.category">
                <a-radio value="freshwater">淡水</a-radio>
                <a-radio value="saltwater">海水</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="平均重量 (kg)" name="avgWeight">
              <a-input-number 
                v-model:value="formState.avgWeight" 
                :min="0" 
                :step="0.1" 
                style="width: 100%" 
                placeholder="0.0" 
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="当前存量 (尾)" name="quantity">
          <a-input-number 
            v-model:value="formState.quantity" 
            :min="0" 
            :step="1" 
            style="width: 100%" 
            placeholder="填写当前鱼存量" 
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchSpecies, createSpecies, updateSpecies, deleteSpecies, fetchVenues } from '@/api';

const loading = ref(false);
const speciesList = ref([]);
const searchQuery = ref('');
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const venueOptions = ref<{ label: string; value: number }[]>([]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '所属钓场', key: 'venue' },
  { title: '品种名称', dataIndex: 'name', key: 'name' },
  { title: '水域类型', key: 'category' },
  { title: '平均重量', key: 'avgWeight' },
  { title: '当前存量', key: 'quantity' },
  { title: '记录时间', dataIndex: 'createdAt', key: 'createdAt', customRender: ({ text }: any) => (text || '').slice(0, 10) },
  { title: '操作', key: 'action', width: 150 },
];

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    const list = res.list || res.data || res || [];
    venueOptions.value = list.map((v: any) => ({
      label: v.name,
      value: v.id
    }));
  } catch (err) {
    message.error('加载钓场选项失败');
  }
};

const loadSpecies = async () => {
  loading.value = true;
  try {
    const res: any = await fetchSpecies({
      page: pagination.current,
      limit: pagination.pageSize,
      keyword: searchQuery.value, // assuming backend uses 'keyword'
    });
    // Due to varying backend formats, ensure robust extraction:
    speciesList.value = res.list || res.data || res || [];
    // Just in case backend returns the raw array or an object
    pagination.total = res.total || speciesList.value.length;
  } catch (err) {
    message.error('加载品种列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadSpecies();
};

const onSearch = () => {
  pagination.current = 1;
  loadSpecies();
};

// Modal Logic
const modalVisible = ref(false);
const isEdit = ref(false);
const modalLoading = ref(false);
const formRef = ref();
const formState = reactive({
  id: undefined,
  venueId: null,
  name: '',
  category: 'freshwater',
  avgWeight: 0,
  quantity: 0,
});

const handleAdd = () => {
  isEdit.value = false;
  Object.assign(formState, {
    id: undefined,
    venueId: venueOptions.value.length > 0 ? venueOptions.value[0].value : null,
    name: '',
    category: 'freshwater',
    avgWeight: 0,
    quantity: 0,
  });
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formState, {
    id: record.id,
    venueId: record.venueId,
    name: record.name,
    category: record.category,
    avgWeight: record.avgWeight ? parseFloat(record.avgWeight) : 0,
    quantity: record.quantity,
  });
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    modalLoading.value = true;
    if (isEdit.value) {
      const { id, ...data } = formState;
      await updateSpecies(id!, data);
      message.success('更新品种成功');
    } else {
      await createSpecies(formState);
      message.success('新增品种成功');
    }
    modalVisible.value = false;
    loadSpecies();
  } catch (err) {
    message.error('操作失败，请检查输入参数');
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async (id: number) => {
  try {
    await deleteSpecies(id);
    message.success('已删除该品种');
    loadSpecies();
  } catch (err) {
    message.error('删除失败');
  }
};

onMounted(() => {
  loadVenues();
  loadSpecies();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.subtitle {
  color: var(--text-dim);
  font-size: 14px;
  margin-top: 4px;
}

.text-dim {
  color: var(--text-dim);
}
</style>