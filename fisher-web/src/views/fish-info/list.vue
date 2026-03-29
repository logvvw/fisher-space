<template>
  <div class="fish-info-page">
    <!-- Header -->
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>鱼讯</h1>
    </header>

    <div class="content-scroll">
      <!-- Tab Filter -->
      <div class="tab-filter glass-effect">
        <div 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- Hot List (热榜) -->
      <div class="info-list hot-list" v-if="activeTab === 'hot' && !loading">
        <div 
          v-for="info in hotList" 
          :key="info.id"
          class="info-card glass-effect hot-card"
          @click="goDetail(info.id)"
        >
          <div class="info-body">
            <div class="info-header">
              <span class="venue-name" v-if="info.venue">{{ info.venue.name || '未知钓场' }}</span><span class="hot-tag"><fire-outlined /> {{ info.like_count || info.likeCount || 0 }}</span>
            </div>
            <p class="info-content">{{ info.content }}</p>
            <div class="info-footer">
              <span class="info-time">{{ formatTime(info.createdAt) }}</span>
              <span class="info-views"><eye-outlined /> {{ info.view_count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommend List (推荐) -->
      <div class="info-list" v-if="activeTab === 'recommend' && !loading">
        <div 
          v-for="info in recommendList" 
          :key="info.id"
          class="info-card glass-effect recommend"
          @click="goDetail(info.id)"
        >
          <div class="recommend-badge">
            <like-outlined /> 推荐
          </div>
          <div class="info-header" v-if="info.venue">
            <span class="venue-name">{{ info.venue.name || '未知钓场' }}</span>
            <a-tag v-if="info.isTop" color="cyan" size="small">置顶</a-tag>
          </div>
          <p class="info-content">{{ info.content }}</p>
          <div class="info-images" v-if="info.images && info.images.length">
            <img v-for="(img, idx) in info.images.slice(0, 3)" :key="idx" :src="img" alt="img" />
          </div>
          <div class="info-footer">
            <span class="info-time">{{ formatTime(info.createdAt) }}</span>
            <div class="info-meta">
              <span v-if="info.biteRate"><thunderbolt-outlined /> {{ info.biteRate }}</span>
              <span><like-outlined /> {{ info.like_count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest List (最新) - 竖向图文卡片 -->
      <div class="info-list latest-list" v-if="activeTab === 'latest' && !loading">
        <div
          v-for="info in fishInfos"
          :key="info.id"
          class="info-card latest-card glass-effect"
          @click="goDetail(info.id)"
        >
          <!-- 封面图区域 -->
          <div class="latest-cover" v-if="info.images && info.images.length">
            <img 
              v-for="(img, idx) in info.images.slice(0, 3)" 
              :key="idx" 
              :src="img" 
              :class="{ 'single': info.images.length === 1, 'double': info.images.length === 2 }"
              alt="img" 
            />
          </div>
          
          <!-- 内容区域 -->
          <div class="latest-body">
            <!-- 标题行 -->
            <div class="latest-header" v-if="info.venue || info.isTop">
              <span class="venue-name" v-if="info.venue">{{ info.venue.name || '未知钓场' }}</span>
              <a-tag v-if="info.isTop" color="red" size="small">置顶</a-tag>
            </div>
            
            <!-- 正文 -->
            <p class="info-content" v-if="info.content">{{ info.content }}</p>
            
            <!-- 底部元信息 -->
            <div class="info-footer">
              <span class="info-time">{{ formatTime(info.createdAt) }}</span>
              <div class="info-meta">
                <span v-if="info.biteRate"><thunderbolt-outlined /> {{ info.biteRate }}</span>
                <span><like-outlined /> {{ info.like_count || 0 }}</span>
                <span><message-outlined /> {{ info.comment_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && fishInfos.length === 0 && activeTab === 'latest'">
        <thunderbolt-outlined class="empty-icon" />
        <p>暂无鱼讯信息</p>
      </div>
      <div class="empty-state glass-effect" v-if="!loading && hotList.length === 0 && activeTab === 'hot'">
        <fire-outlined class="empty-icon" />
        <p>暂无热榜数据</p>
      </div>
      <div class="empty-state glass-effect" v-if="!loading && recommendList.length === 0 && activeTab === 'recommend'">
        <like-outlined class="empty-icon" />
        <p>暂无推荐内容</p>
      </div>

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <a-spin size="large" />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav glass-effect">
      <div class="nav-item" @click="$router.push('/home')"><home-outlined /><span>首页</span></div>
      <div class="nav-item active"><read-outlined /><span>鱼讯</span></div>
      <div class="nav-item" @click="$router.push('/info/list')"><appstore-outlined /><span>发现</span></div>
      <div class="nav-item" @click="$router.push('/user/profile')"><user-outlined /><span>我的</span></div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { fetchFishInfos } from '@/api';
import { 
  LeftOutlined,
  HomeOutlined,
  ReadOutlined,
  AppstoreOutlined,
  UserOutlined,
  ThunderboltOutlined,
  FireOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);
const fishInfos = ref<any[]>([]);
const hotList = ref<any[]>([]);
const recommendList = ref<any[]>([]);
const activeTab = ref('hot');

const tabs = [
  { label: '热榜', value: 'hot' },
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'latest' },
];

const formatTime = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString();
};

const goDetail = (id: number) => {
  // No detail page yet - could show a modal or toast
  console.log('View fish info:', id);
};

const loadData = async () => {
  loading.value = true;
  try {
    const params: any = { page: 1, pageSize: 20 };
    
    if (activeTab.value === 'hot') {
      params.sort = 'hot';
    } else if (activeTab.value === 'recommend') {
      params.isTop = true;
    }
    
    const res: any = await fetchFishInfos(params);
    const list = Array.isArray(res) ? res : (res.data || res.list || []);
    
    if (activeTab.value === 'hot') {
      hotList.value = list.sort((a, b) => (b.like_count || b.likeCount || 0) - (a.like_count || a.likeCount || 0));
    } else if (activeTab.value === 'recommend') {
      recommendList.value = list.filter((item: any) => item.isTop || item.like_count > 50);
    } else {
      fishInfos.value = list;
    }
  } catch {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

const switchTab = (tab: string) => {
  activeTab.value = tab;
  loadData();
};

onMounted(loadData);
</script>

<style scoped>
.fish-info-page {
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

.tab-filter {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 16px;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  background: var(--primary-color);
  color: #000;
  font-weight: bold;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card {
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.info-card:active {
  transform: scale(0.98);
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.venue-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--primary-color);
}

.info-content {
  font-size: 15px;
  color: #fff;
  line-height: 1.6;
  margin: 0 0 12px;
}

.info-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.info-images img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.info-meta {
  display: flex;
  align-items: center;
  gap: 8px;
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

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
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

.nav-item.active {
  color: var(--primary-color);
  transform: translateY(-4px);
}

/* Latest List - 竖向图文卡片样式 */
.latest-list .info-card {
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.latest-cover {
  display: grid;
  gap: 2px;
  margin-bottom: 0;
}

.latest-cover img {
  width: 100%;
  height: 180px;
  border-radius: 0;
  object-fit: cover;
}

.latest-cover img.single {
  height: 200px;
}

.latest-cover img.double {
  height: 160px;
}

.latest-cover img:nth-child(n+4) {
  display: none;
}

.latest-body {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.latest-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 热榜列表样式 - 角标跟在标题后面 */
.hot-list .info-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 16px;
}

.hot-list .info-body {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .latest-cover img {
    height: 150px;
  }
  .latest-cover img.single {
    height: 160px;
  }
  .latest-cover img.double {
    height: 130px;
  }
}

/* Recommend Styles */
.info-card.recommend {
  flex-direction: column;
}

.hot-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff6b6b;
}

.recommend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}
</style>