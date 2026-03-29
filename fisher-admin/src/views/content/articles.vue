<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">文章管理</h2>
        <p class="subtitle">管理垂钓知识库文章，支持分类和发布状态</p>
      </div>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        发布文章
      </a-button>
    </div>

    <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
      <a-select v-model:value="filterCategory" placeholder="分类" style="width: 140px;" allow-clear @change="loadArticles">
        <a-select-option value="technique">技巧</a-select-option>
        <a-select-option value="encyclopedia">百科</a-select-option>
        <a-select-option value="news">资讯</a-select-option>
      </a-select>
      <a-select v-model:value="filterStatus" placeholder="状态" style="width: 140px;" allow-clear @change="loadArticles">
        <a-select-option value="draft">草稿</a-select-option>
        <a-select-option value="published">已发布</a-select-option>
      </a-select>
      <a-input-search v-model:value="searchQuery" placeholder="搜索标题..." style="width: 280px;" @search="loadArticles" />
    </div>

    <a-table
      :columns="columns"
      :data-source="articles"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'category'">
          <a-tag :color="getCategoryColor(record.category)">{{ getCategoryLabel(record.category) }}</a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'published' ? 'green' : 'orange'">
            {{ record.status === 'published' ? '已发布' : '草稿' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'author'">
          <span>{{ record.author?.nickname || record.author?.username || '-' }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除该文章？" @confirm="confirmDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑文章' : '发布文章'" width="700px" @ok="handleModalOk" :confirm-loading="modalLoading" class="admin-modal">
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="formState.title" placeholder="请输入文章标题" />
        </a-form-item>
        <a-form-item label="摘要" name="summary">
          <a-textarea v-model:value="formState.summary" placeholder="请输入文章摘要（可选）" :rows="2" />
        </a-form-item>
        <a-form-item label="封面图" name="cover">
          <a-input v-model:value="formState.cover" placeholder="请输入封面图片URL（可选）" />
        </a-form-item>
        <div v-if="formState.cover" style="margin-top: -8px; margin-bottom: 8px;">
          <img :src="formState.cover" style="width: 160px; height: 90px; object-fit: cover; border-radius: 8px;" />
        </div>
        <a-form-item label="分类" name="category" :rules="[{ required: true, message: '请选择分类' }]">
          <a-select v-model:value="formState.category" placeholder="请选择分类">
            <a-select-option value="technique">垂钓技巧</a-select-option>
            <a-select-option value="encyclopedia">鱼类百科</a-select-option>
            <a-select-option value="news">行业资讯</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="formState.status" placeholder="请选择状态">
            <a-select-option value="draft">草稿</a-select-option>
            <a-select-option value="published">已发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="正文内容" name="content" :rules="[{ required: true, message: '请输入正文内容' }]">
          <a-textarea v-model:value="formState.content" placeholder="请输入文章正文" :rows="8" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '@/api';

const loading = ref(false);
const articles = ref<any[]>([]);
const filterCategory = ref('');
const filterStatus = ref('');
const searchQuery = ref('');
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const modalLoading = ref(false);
const isEdit = ref(false);
const formRef = ref();
const editingId = ref<number | null>(null);

const formState = reactive({
  title: '',
  summary: '',
  cover: '',
  category: 'technique',
  status: 'draft',
  content: '',
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '分类', key: 'category', width: 100 },
  { title: '状态', key: 'status', width: 90 },
  { title: '阅读', dataIndex: 'viewCount', key: 'viewCount', width: 80 },
  { title: '作者', key: 'author', width: 100 },
  { title: '操作', key: 'action', width: 150 },
];

const getCategoryLabel = (cat: string) => ({ technique: '技巧', encyclopedia: '百科', news: '资讯' }[cat] || cat);
const getCategoryColor = (cat: string) => ({ technique: 'blue', encyclopedia: 'purple', news: 'green' }[cat] || 'default');

const loadArticles = async () => {
  loading.value = true;
  try {
    const res: any = await fetchArticles({ page: pagination.current, pageSize: pagination.pageSize, category: filterCategory.value || undefined, status: filterStatus.value || undefined });
    articles.value = res?.items || res?.list || res?.data || res || [];
    if (res?.total) pagination.total = res.total;
  } catch {
    message.error('加载文章列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadArticles();
};

const handleAdd = () => {
  isEdit.value = false;
  editingId.value = null;
  Object.assign(formState, { title: '', summary: '', cover: '', category: 'technique', status: 'draft', content: '' });
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  editingId.value = record.id;
  Object.assign(formState, { title: record.title, summary: record.summary || '', cover: record.cover || '', category: record.category, status: record.status, content: record.content });
  modalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    modalLoading.value = true;
    const payload = { title: formState.title, summary: formState.summary, cover: formState.cover, category: formState.category, status: formState.status, content: formState.content };
    if (isEdit.value && editingId.value != null) {
      await updateArticle(editingId.value, payload);
      message.success('更新成功');
    } else {
      await createArticle(payload);
      message.success('创建成功');
    }
    modalVisible.value = false;
    loadArticles();
  } catch {
    message.error('操作失败');
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async (id: number) => {
  try {
    await deleteArticle(id);
    message.success('删除成功');
    loadArticles();
  } catch {
    message.error('删除失败');
  }
};

onMounted(loadArticles);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>