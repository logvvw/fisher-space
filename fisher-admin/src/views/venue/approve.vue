<template>
  <div class="venue-approve-page glass-panel">
    <div class="page-header">
      <div>
        <h2 class="text-gradient">钓场审核</h2>
        <p class="subtitle">管理并审核新注册或变更的钓场信息</p>
      </div>
      <a-button type="primary" @click="loadPendingVenues">
        <template #icon><ReloadOutlined /></template>
        刷新列表
      </a-button>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="venueList" 
      row-key="id" 
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      class="admin-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'applicant'">
          <span>{{ record.user?.nickname || record.user?.username || '未知用户' }}</span>
        </template>
        <template v-if="column.key === 'region'">
          <span>{{ [record.province, record.city, record.district].filter(Boolean).join(' ') || '-' }}</span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag color="orange">待审核</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space size="small">
            <a-button type="link" size="small" @click="viewDetails(record)">查看详情</a-button>
            <a-popconfirm title="确认审核通过该钓场吗？" @confirm="handleApprove(record.id)">
              <a-button type="link" size="small" style="color: #52c41a">通过</a-button>
            </a-popconfirm>
            <a-popconfirm title="确认拒绝该钓场的申请吗？" @confirm="handleReject(record.id)">
              <a-button type="link" size="small" style="color: #ff4d4f">拒绝</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 详情抽屉/弹窗 -->
    <a-drawer
      title="钓场详细档案"
      placement="right"
      :width="640"
      :open="detailsVisible"
      @close="detailsVisible = false"
      class="glass-drawer"
    >
      <template v-if="currentVenue">
        <!-- 封面大图 -->
        <div style="margin-bottom: 24px; text-align: center;">
          <a-image 
            v-if="currentVenue.coverImage" 
            :src="currentVenue.coverImage" 
            style="max-height: 240px; border-radius: 12px; object-fit: cover;" 
            alt="钓场封面" 
            fallback="https://via.placeholder.com/640x360?text=暂无封面"
          />
          <div v-else style="height: 160px; background: rgba(0,0,0,0.02); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-dim)">
            尚未上传实景封面
          </div>
        </div>

        <a-descriptions bordered :column="2" size="middle" class="venue-detail-desc">
          <a-descriptions-item label="核心信息" :span="2">
            <h3 style="margin: 0; color: var(--text-bright)">{{ currentVenue.name }}</h3>
          </a-descriptions-item>

          <a-descriptions-item label="申请人" :span="1">
            <a-space>
              <a-avatar size="small" :src="currentVenue.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentVenue.user?.username || 'U'}`" />
              <span>{{ currentVenue.user?.nickname || currentVenue.user?.username }}</span>
            </a-space>
          </a-descriptions-item>

          <a-descriptions-item label="联系电话" :span="1">
            <a-tag color="blue" v-if="currentVenue.phone">{{ currentVenue.phone }}</a-tag>
            <span v-else>未填写</span>
          </a-descriptions-item>

          <a-descriptions-item label="所在行政区" :span="1">
            {{ [currentVenue.province, currentVenue.city, currentVenue.district].filter(Boolean).join(' ') }}
          </a-descriptions-item>
          
          <a-descriptions-item label="详细点位" :span="1">
            {{ currentVenue.address || '未填写' }}
          </a-descriptions-item>

          <a-descriptions-item label="营业时间" :span="1">
            <span v-if="currentVenue.businessHours"><ClockCircleOutlined style="margin-right: 4px;"/>{{ currentVenue.businessHours }}</span>
            <span v-else>未填写</span>
          </a-descriptions-item>

          <a-descriptions-item label="占地规模" :span="1">
            {{ currentVenue.area ? currentVenue.area + ' 亩' : '未提供' }}
          </a-descriptions-item>

          <a-descriptions-item label="配套服务/设施" :span="2">
            <template v-if="currentVenue.facilities && currentVenue.facilities.length > 0">
              <a-space wrap>
                <a-tag v-for="fac in currentVenue.facilities" :key="fac" color="cyan">{{ fac }}</a-tag>
              </a-space>
            </template>
            <span v-else>无特定服务设施上报</span>
          </a-descriptions-item>

          <a-descriptions-item label="场地详细介绍" :span="2">
            <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">{{ currentVenue.description || '暂无文字介绍' }}</p>
          </a-descriptions-item>
        </a-descriptions>

        <div class="drawer-actions">
          <a-button @click="handleReject(currentVenue.id)" danger block style="flex: 1;">驳回申请</a-button>
          <a-button type="primary" @click="handleApprove(currentVenue.id)" block style="flex: 1;">审核通过（发布）</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchVenues, approveVenue, rejectVenue } from '@/api';

const loading = ref(false);
const venueList = ref([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '钓场名称', dataIndex: 'name', key: 'name' },
  { title: '申请人', key: 'applicant' },
  { title: '所在地区', key: 'region' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '申请时间', dataIndex: 'createdAt', key: 'createdAt', customRender: ({ text }: any) => (text || '').slice(0, 10) },
  { title: '状态', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 220 },
];

const loadPendingVenues = async () => {
  loading.value = true;
  try {
    const res: any = await fetchVenues({
      page: pagination.current,
      limit: pagination.pageSize,
      status: 'pending',
    });
    // Due to findAll logic 'res' might literally be an array if server returns no 'list', wait actually VenuesService.findAll returns { list, total }
    venueList.value = res.list || res.data || res;
    pagination.total = res.total || venueList.value.length;
  } catch (err) {
    message.error('获取待审核列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadPendingVenues();
};

const detailsVisible = ref(false);
const currentVenue = ref<any>(null);

const viewDetails = (record: any) => {
  currentVenue.value = record;
  detailsVisible.value = true;
};

const handleApprove = async (id: number) => {
  try {
    await approveVenue(id);
    message.success('审核通过成功');
    detailsVisible.value = false;
    loadPendingVenues();
  } catch (err) {
    message.error('操作失败');
  }
};

const handleReject = async (id: number) => {
  try {
    await rejectVenue(id);
    message.success('已拒绝该申请');
    detailsVisible.value = false;
    loadPendingVenues();
  } catch (err) {
    message.error('操作失败');
  }
};

onMounted(loadPendingVenues);
</script>

<style scoped>
.venue-approve-page {
  animation: fadeIn 0.5s ease-out;
  padding: 24px;
  border-radius: 12px;
}

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

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.ant-descriptions-item-label) {
  width: 120px;
  background-color: rgba(0,0,0,0.02) !important;
  color: var(--text-dim);
}
:deep(.ant-descriptions-item-content) {
  color: var(--text-bright);
}
</style>