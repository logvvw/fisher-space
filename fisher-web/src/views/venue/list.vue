<template>
  <div class="venue-list-page">
    <!-- Header -->
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>找钓场</h1>
    </header>

    <div class="content-scroll">
      <!-- Search & Filter -->
      <div class="search-section glass-effect">
        <div class="search-bar">
          <search-outlined class="search-icon" />
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索钓场名称..."
            @keyup.enter="handleSearch"
          />
          <a-button v-if="searchKeyword" type="text" size="small" @click="clearSearch">
            <close-circle-outlined />
          </a-button>
        </div>
        <div class="filter-tags">
          <div 
            v-for="status in statusFilters" 
            :key="status.value"
            class="filter-tag"
            :class="{ active: activeStatus === status.value }"
            @click="switchStatus(status.value)"
          >
            {{ status.label }}
          </div>
        </div>
      </div>

      <!-- Venue List -->
      <div class="venue-list" v-if="!loading">
        <div 
          v-for="venue in venues" 
          :key="venue.id"
          class="venue-card glass-effect"
          @click="goDetail(venue.id)"
        >
          <div class="venue-image">
            <img :src="venue.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400'" :alt="venue.name" />
            <div class="venue-status" :class="getStatusClass(venue.status)">
              {{ getStatusText(venue.status) }}
            </div>
          </div>
          <div class="venue-info">
            <h3 class="venue-name">{{ venue.name }}</h3>
            <p class="venue-address">
              <environment-outlined /> {{ venue.province }}{{ venue.city }}{{ venue.district }}{{ venue.address }}
            </p>
            <div class="venue-meta">
              <span class="meta-item" v-if="venue.area">
                <home-outlined /> {{ venue.area }}亩
              </span>
              <span class="meta-item" v-if="venue.phone">
                <phone-outlined /> {{ venue.phone }}
              </span>
            </div>
            <div class="venue-tags" v-if="venue.facilities && venue.facilities.length">
              <a-tag v-for="(fac, idx) in venue.facilities.slice(0, 3)" :key="idx" color="blue" size="small">
                {{ fac }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && venues.length === 0">
        <coffee-outlined class="empty-icon" />
        <p>暂无钓场信息</p>
        <p class="empty-hint">换个搜索条件试试</p>
      </div>

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <a-spin size="large" />
      </div>

      <!-- Load More / Pagination -->
      <div class="pagination-section" v-if="venues.length > 0 && !loading">
        <a-button 
          v-if="hasMore" 
          block 
          :loading="loadingMore" 
          @click="loadMore"
        >
          加载更多
        </a-button>
        <p v-else class="no-more">没有更多了</p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav glass-effect">
      <div class="nav-item" @click="$router.push('/home')"><home-outlined /><span>首页</span></div>
      <div class="nav-item" @click="$router.push('/fish-info')"><read-outlined /><span>鱼讯</span></div>
      <div class="nav-item" @click="$router.push('/info/list')"><appstore-outlined /><span>发现</span></div>
      <div class="nav-item" @click="$router.push('/user/profile')"><user-outlined /><span>我的</span></div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { fetchVenues } from '@/api';
import { 
  LeftOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
  CoffeeOutlined,
  HomeFilled,
  ReadOutlined,
  AppstoreOutlined,
  UserOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);
const loadingMore = ref(false);
const venues = ref<any[]>([]);
const searchKeyword = ref('');
const activeStatus = ref('approved');
const currentPage = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);

const statusFilters = [
  { label: '营业中', value: 'approved' },
  { label: '已下线', value: 'offline' },
  { label: '待审核', value: 'pending' },
  { label: '全部', value: '' },
];

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    approved: 'status-open',
    pending: 'status-pending',
    offline: 'status-offline',
    rejected: 'status-rejected',
  };
  return map[status] || 'status-offline';
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    approved: '营业中',
    pending: '待审核',
    offline: '已下线',
    rejected: '已拒绝',
  };
  return map[status] || status;
};

const goDetail = (id: number) => {
  router.push(`/venue/${id}`);
};

const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const clearSearch = () => {
  searchKeyword.value = '';
  handleSearch();
};

const switchStatus = (status: string) => {
  activeStatus.value = status;
  currentPage.value = 1;
  loadData();
};

const loadData = async (append = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    }
    if (activeStatus.value) {
      params.status = activeStatus.value;
    }
    
    const res: any = await fetchVenues(params);
    const list = res.data?.list || res.list || res.data || [];
    const total = res.data?.total || res.total || list.length;
    
    if (append) {
      venues.value = [...venues.value, ...list];
    } else {
      venues.value = list;
    }
    
    hasMore.value = venues.value.length < total;
  } catch {
    message.error('加载失败');
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  currentPage.value++;
  loadData(true);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.venue-list-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
  padding-bottom: 80px;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
}

.back-btn {
  font-size: 18px;
  color: #fff;
  padding: 8px;
  margin-left: -8px;
  cursor: pointer;
}

.page-header h1 {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #fff;
  margin: 0;
  padding-right: 40px;
}

.content-scroll {
  padding: 16px;
}

.search-section {
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 0 16px;
  height: 44px;
  margin-bottom: 12px;
}

.search-icon {
  color: var(--text-muted);
  margin-right: 8px;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.search-bar input::placeholder {
  color: var(--text-muted);
}

.filter-tags {
  display: flex;
  gap: 10px;
}

.filter-tag {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag.active {
  background: var(--primary-color);
  color: #000;
  font-weight: bold;
}

.venue-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.venue-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.venue-card:active {
  transform: scale(0.98);
}

.venue-image {
  position: relative;
  height: 160px;
}

.venue-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.venue-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-open {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: #fff;
}

.status-pending {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  color: #000;
}

.status-offline {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.status-rejected {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #fff;
}

.venue-info {
  padding: 16px;
}

.venue-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 8px;
}

.venue-address {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.venue-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.meta-item {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.venue-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.empty-state {
  padding: 60px 20px;
  border-radius: 16px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0;
}

.empty-hint {
  font-size: 12px;
  margin-top: 8px !important;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.pagination-section {
  padding: 20px 0;
  text-align: center;
}

.no-more {
  font-size: 13px;
  color: var(--text-muted);
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  border-top: 1px solid var(--glass-border);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 20px;
}

.nav-item span {
  font-size: 10px;
}
</style>