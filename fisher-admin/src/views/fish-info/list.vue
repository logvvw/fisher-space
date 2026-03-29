<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">鱼讯管理</h2>
        <p class="subtitle">发布和管理鱼情信息，支持置顶和删除</p>
      </div>
      <a-button type="primary" @click="goPublish">
        <template #icon><PlusOutlined /></template>
        发布鱼讯
      </a-button>
    </div>

    <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
      <a-select v-model:value="venueFilter" placeholder="筛选钓场" style="width: 200px;" allow-clear @change="loadFishInfos">
        <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
      </a-select>
      <a-input-search v-model:value="searchQuery" placeholder="搜索鱼讯内容..." style="width: 280px;" @search="loadFishInfos" />
    </div>

    <a-table
      :columns="columns"
      :data-source="fishInfos"
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
        <template v-else-if="column.key === 'content'">
          <span>{{ (record.content || '').length > 50 ? (record.content || '').slice(0, 50) + '...' : record.content }}</span>
        </template>
        <template v-else-if="column.key === 'images'">
          <span>{{ (record.images && record.images.length) || 0 }} 张</span>
        </template>
        <template v-else-if="column.key === 'isTop'">
          <a-tag v-if="record.isTop" color="green">置顶</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="editFish(record)">编辑</a-button>
            <a-button type="link" size="small" @click="toggleTop(record)">{{ record.isTop ? '取消置顶' : '置顶' }}</a-button>
            <a-popconfirm title="确认删除该鱼讯？" @confirm="confirmDelete(record.id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchFishInfos, deleteFishInfo, topFishInfo, fetchVenues } from '@/api';

const router = useRouter();
const loading = ref(false);
const fishInfos = ref<any[]>([]);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const venueFilter = ref<number | null>(null);
const searchQuery = ref('');
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '钓场', key: 'venue', width: 140 },
  { title: '鱼讯内容', key: 'content' },
  { title: '热度', dataIndex: 'biteRate', key: 'biteRate', width: 80 },
  { title: '图片', key: 'images', width: 70 },
  { title: '置顶', key: 'isTop', width: 80 },
  { title: '操作', key: 'action', width: 210 },
];

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    venueOptions.value = (res?.list || res || []).map((v: any) => ({ label: v.name, value: v.id }));
  } catch { /* silent */ }
};

const loadFishInfos = async () => {
  loading.value = true;
  try {
    const res: any = await fetchFishInfos({ page: pagination.current, pageSize: pagination.pageSize, venueId: venueFilter.value });
    fishInfos.value = Array.isArray(res) ? res : (res?.items || res?.list || res?.data || []);
    if (res?.total) pagination.total = res.total;
  } catch {
    message.error('加载鱼讯列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadFishInfos();
};

const goPublish = () => router.push({ path: '/fish-info/publish' });
const editFish = (record: any) => router.push({ path: '/fish-info/publish', query: { id: String(record.id) } });

const toggleTop = async (record: any) => {
  try {
    await topFishInfo(record.id);
    message.success(record.isTop ? '已取消置顶' : '置顶成功');
    loadFishInfos();
  } catch {
    message.error('操作失败');
  }
};

const confirmDelete = async (id: number) => {
  try {
    await deleteFishInfo(id);
    message.success('删除成功');
    loadFishInfos();
  } catch {
    message.error('删除失败');
  }
};

onMounted(() => { loadVenues(); loadFishInfos(); });
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
</style>