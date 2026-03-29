<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">轮播管理</h2>
        <p class="subtitle">管理首页轮播图，支持多位置配置</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增轮播
      </a-button>
    </div>

    <div style="margin-bottom: 16px; max-width: 400px;">
      <a-input-search v-model:value="searchQuery" placeholder="搜索轮播标题..." @search="loadBanners" />
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <img :src="record.image" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />
        </template>
        <template v-else-if="column.key === 'position'">
          <a-tag :color="record.position === 'home_leisure' ? 'blue' : 'purple'">
            {{ record.position === 'home_leisure' ? '首页休闲' : '首页经营' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除该轮播图？" @confirm="confirmDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑轮播' : '新增轮播'" @ok="handleModalOk" :confirm-loading="modalLoading" class="admin-modal">
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="formState.title" placeholder="请输入轮播标题" />
        </a-form-item>
        <a-form-item label="图片地址" name="image" :rules="[{ required: true, message: '请输入图片地址' }]">
          <a-input v-model:value="formState.image" placeholder="请输入图片URL" />
        </a-form-item>
        <div v-if="formState.image" style="margin: -8px 0 8px 0;">
          <span style="font-size: 12px; color: var(--text-muted);">预览：</span>
          <img :src="formState.image" style="width: 200px; height: 110px; object-fit: cover; border-radius: 8px; margin-top: 4px;" />
        </div>
        <a-form-item label="跳转链接" name="link">
          <a-input v-model:value="formState.link" placeholder="点击轮播跳转的链接（可选）" />
        </a-form-item>
        <a-form-item label="位置" name="position" :rules="[{ required: true, message: '请选择位置' }]">
          <a-select v-model:value="formState.position" placeholder="请选择位置">
            <a-select-option value="home_leisure">首页休闲</a-select-option>
            <a-select-option value="home_business">首页经营</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序值" name="sortOrder">
          <a-input-number v-model:value="formState.sortOrder" :min="0" style="width: 100%;" />
        </a-form-item>
        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="formState.status" placeholder="请选择状态">
            <a-select-option value="active">启用</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '@/api';

const loading = ref(false);
const banners = ref<any[]>([]);
const searchQuery = ref('');
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const modalLoading = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formState = reactive({
  id: undefined as number | undefined,
  title: '',
  image: '',
  link: '',
  position: 'home_leisure',
  sortOrder: 0,
  status: 'active',
});

const dataSource = computed(() => {
  const q = (searchQuery.value || '').toLowerCase();
  if (!q) return banners.value;
  return banners.value.filter(b => (b.title || '').toLowerCase().includes(q));
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '图片', key: 'image', width: 80 },
  { title: '位置', key: 'position', width: 100 },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 150 },
];

const loadBanners = async () => {
  loading.value = true;
  try {
    const res: any = await fetchBanners();
    banners.value = Array.isArray(res) ? res : (res?.list || res?.data || []);
    pagination.total = dataSource.value.length;
  } catch {
    message.error('加载轮播列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

const handleAdd = () => {
  isEdit.value = false;
  Object.assign(formState, { id: undefined, title: '', image: '', link: '', position: 'home_leisure', sortOrder: 0, status: 'active' });
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formState, { id: record.id, title: record.title, image: record.image, link: record.link, position: record.position, sortOrder: record.sortOrder, status: record.status });
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    modalLoading.value = true;
    const payload = { title: formState.title, image: formState.image, link: formState.link, position: formState.position, sortOrder: formState.sortOrder, status: formState.status };
    if (isEdit.value && formState.id != null) {
      await updateBanner(formState.id, payload);
      message.success('更新成功');
    } else {
      await createBanner(payload);
      message.success('创建成功');
    }
    modalVisible.value = false;
    loadBanners();
  } catch {
    message.error('操作失败');
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async (id: number) => {
  try {
    await deleteBanner(id);
    message.success('删除成功');
    loadBanners();
  } catch {
    message.error('删除失败');
  }
};

onMounted(loadBanners);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>