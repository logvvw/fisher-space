<template>
  <div class="home-container">
    <!-- Modern Header -->
    <header class="main-header glass-effect">
      <div class="logo text-gradient">FISHER PORTAL</div>
      <div class="header-right">
        <a-dropdown v-if="userStore.isLoggedIn" placement="bottomRight">
          <div class="user-avatar">
            <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="avatar" />
            <span v-else class="avatar-text">{{ userStore.userInfo?.nickname?.[0] || userStore.userInfo?.username?.[0] || 'U' }}</span>
          </div>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="profile">
                <user-outlined /> 个人中心
              </a-menu-item>
              <a-menu-item key="favorites">
                <star-outlined /> 我的收藏
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <logout-outlined /> 退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button v-else type="text" class="icon-btn" @click="$router.push('/login')">
          <template #icon><user-outlined /></template>
        </a-button>
      </div>
    </header>

    <div class="content-scroll">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1 class="hero-title">探索<span>水边</span>的精彩</h1>
          <p class="hero-subtitle">智能垂钓助手，为您连接每一处静谧水域</p>
          <div class="search-bar glass-effect">
            <search-outlined class="search-icon" />
            <input type="text" placeholder="搜索钓场、资讯、技巧..." />
          </div>
        </div>
      </section>

      <!-- Mode Switcher -->
      <div class="mode-switcher-container">
        <div class="mode-switcher glass-effect">
          <div 
            class="mode-item" 
            :class="{ active: activeTab === 'leisure' }"
            @click="activeTab = 'leisure'"
          >休闲钓</div>
          <div 
            class="mode-item" 
            :class="{ active: activeTab === 'business' }"
            @click="switchTab('business')"
          >钓场经营</div>
        </div>
      </div>

      <!-- Quick Entry Grid -->
      <section class="quick-entry">
        <div 
          v-for="item in menuItems" 
          :key="item.title"
          class="menu-card glass-effect"
          @click="$router.push(item.path)"
        >
          <div class="menu-icon" :style="{ background: item.color }">
            <component :is="item.icon" />
          </div>
          <span class="menu-label">{{ item.title }}</span>
        </div>
      </section>

      <!-- Featured Venues -->
      <section class="section-container">
        <div class="section-header">
          <h2 class="section-title">精选钓场</h2>
          <span class="more-link" @click="$router.push('/venue/list')">查看全部 <right-outlined /></span>
        </div>
        <div class="venue-cards horizontal-scroll">
          <div 
            v-for="venue in venues" 
            :key="venue.id" 
            class="venue-card glass-effect"
            @click="goDetail(venue.id)"
          >
            <div class="card-image">
              <img :src="venue.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400'" alt="venue" />
              <div class="venue-tag">推荐</div>
            </div>
            <div class="card-info">
              <h3>{{ venue.name }}</h3>
              <p><environment-outlined /> {{ venue.address }}</p>
              <div class="card-meta">
                <span>{{ venue.area || '-' }} 亩</span>
                <span class="price-tag">按斤/按天</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Fish News -->
      <section class="section-container">
        <div class="section-header">
          <h2 class="section-title">最新鱼讯</h2>
        </div>
        <div class="news-list">
          <div 
            v-for="info in fishInfos" 
            :key="info.id" 
            class="news-item glass-effect"
          >
            <div class="news-header">
              <span class="venue-name">{{ info.venue?.name }}</span>
              <span class="news-date">{{ info.createdAt }}</span>
            </div>
            <p class="news-body">{{ info.content }}</p>
            <div class="news-footer" v-if="info.isTop">
              <a-tag color="cyan">置顶推荐</a-tag>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav glass-effect">
      <div class="nav-item active"><home-filled /><span>首页</span></div>
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
import { useUserStore } from '@/stores/user';
import { 
  UserOutlined, 
  SearchOutlined, 
  RightOutlined,
  EnvironmentOutlined,
  HomeFilled,
  ReadOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  BookOutlined,
  BulbOutlined,
  StarOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';
import { fetchVenues, fetchFishInfos } from '@/api';

const router = useRouter();
const userStore = useUserStore();
const activeTab = ref('leisure');
const venues = ref<any[]>([]);
const fishInfos = ref<any[]>([]);

const handleLogout = () => {
  userStore.logout();
  message.success('已退出登录');
  router.push('/home');
};

const menuItems = [
  { title: '找钓场', icon: CoffeeOutlined, path: '/venue/list', color: 'linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%)' },
  { title: '看鱼讯', icon: ThunderboltOutlined, path: '/fish-info', color: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' },
  { title: '垂钓学堂', icon: BookOutlined, path: '/info/list?category=technique', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: '鱼类百科', icon: BulbOutlined, path: '/info/list?category=encyclopedia', color: 'linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)' },
];

const switchTab = (tab: string) => {
  if (tab === 'business') {
    router.push('/home/business');
  }
};

const goDetail = (id: number) => {
  router.push(`/venue/${id}`);
};

const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'profile') {
    router.push('/user/profile');
  } else if (key === 'favorites') {
    router.push('/user/favorites');
  }
};

const loadData = async () => {
  try {
    const [venuesData, fishData] = await Promise.all([
      fetchVenues({ page: 1, pageSize: 6, status: 'APPROVED' }),
      fetchFishInfos({ page: 1, pageSize: 10 }),
    ]);
    venues.value = venuesData;
    fishInfos.value = (fishData || []).map((info: any) => ({
      ...info,
      venue: { name: info.venue?.name || '' },
    }));
  } catch (error) {
    message.error('数据同步失败');
  }
};

onMounted(loadData);
</script>

<style scoped>
.home-container {
  padding-top: 60px;
  padding-bottom: 80px;
  overflow-x: hidden;
}

/* Header */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
}

.logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
}

.icon-btn {
  color: #fff;
  font-size: 20px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  text-transform: uppercase;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 240px;
  padding: 40px 20px;
  display: flex;
  align-items: flex-end;
  background: radial-gradient(circle at 20% 100%, rgba(0, 242, 254, 0.15) 0%, transparent 40%);
}

.hero-content {
  width: 100%;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #fff;
}

.hero-title span {
  color: var(--primary-color);
}

.hero-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  border-radius: 24px;
}

.search-icon {
  font-size: 18px;
  color: var(--primary-color);
  margin-right: 12px;
}

.search-bar input {
  background: transparent;
  border: none;
  color: #fff;
  flex: 1;
  outline: none;
  font-size: 14px;
}

/* Mode Switcher */
.mode-switcher-container {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.mode-switcher {
  display: flex;
  padding: 4px;
  border-radius: 20px;
  width: 220px;
}

.mode-item {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-item.active {
  background: var(--primary-color);
  color: #000;
  font-weight: bold;
}

/* Quick Entry */
.quick-entry {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 20px;
  margin-bottom: 32px;
}

.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  border-radius: 16px;
  transition: transform 0.2s;
}

.menu-card:active {
  transform: scale(0.95);
}

.menu-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-label {
  font-size: 11px;
  color: var(--text-muted);
}

/* Sections */
.section-container {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.more-link {
  font-size: 13px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Venue Cards */
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 4px 20px 16px;
  scroll-snap-type: x mandatory;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

.venue-card {
  min-width: 240px;
  border-radius: 20px;
  overflow: hidden;
  scroll-snap-align: start;
}

.card-image {
  position: relative;
  height: 140px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.venue-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary-color);
  color: #000;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}

.card-info {
  padding: 16px;
}

.card-info h3 {
  font-size: 16px;
  color: #fff;
  margin-bottom: 8px;
}

.card-info p {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.price-tag {
  color: var(--primary-color);
}

/* News List */
.news-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  padding: 16px;
  border-radius: 16px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
}

.venue-name {
  color: var(--primary-color);
  font-weight: bold;
}

.news-date {
  color: var(--text-muted);
}

.news-body {
  font-size: 14px;
  color: #eee;
  line-height: 1.5;
  margin: 0;
}

.news-footer {
  margin-top: 10px;
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
  padding-bottom: Env(safe-area-inset-bottom);
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
  transition: all 0.3s;
}

.nav-item span {
  font-size: 10px;
}

.nav-item.active {
  color: var(--primary-color);
  transform: translateY(-4px);
}
</style>