<template>
  <div class="venue-detail-page">
    <!-- Header -->
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>钓场详情</h1>
      <div class="header-action" v-if="venue">
        <a-button type="text" @click="handleFavorite">
          <star-outlined :style="{ color: isFavorite ? '#ffd700' : '#fff', fontSize: '20px' }" />
        </a-button>
      </div>
    </header>

    <!-- Loading -->
    <div class="loading-state" v-if="loading">
      <a-spin size="large" />
    </div>

    <div class="content-scroll" v-if="venue && !loading">
      <!-- Cover Image -->
      <div class="venue-cover">
        <img :src="venue.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800'" :alt="venue.name" />
        <div class="cover-overlay">
          <div class="venue-name-overlay">{{ venue.name }}</div>
          <div class="venue-status-badge" :class="getStatusClass(venue.status)">
            {{ getStatusText(venue.status) }}
          </div>
        </div>
      </div>

      <!-- Basic Info -->
      <div class="info-section glass-effect">
        <div class="info-row">
          <environment-outlined class="info-icon" />
          <span>{{ venue.province }}{{ venue.city }}{{ venue.district }}{{ venue.address || '' }}</span>
        </div>
        <div class="info-row" v-if="venue.phone">
          <phone-outlined class="info-icon" />
          <a :href="'tel:' + venue.phone">{{ venue.phone }}</a>
        </div>
        <div class="info-row" v-if="venue.businessHours">
          <clock-circle-outlined class="info-icon" />
          <span>{{ venue.businessHours }}</span>
        </div>
        <div class="info-row" v-if="venue.area">
          <home-outlined class="info-icon" />
          <span>{{ venue.area }} 亩</span>
        </div>
      </div>

      <!-- Facilities -->
      <div class="info-section glass-effect" v-if="venue.facilities && venue.facilities.length">
        <h3 class="section-title">设施配套</h3>
        <div class="facilities-grid">
          <div 
            v-for="(fac, idx) in venue.facilities" 
            :key="idx"
            class="facility-item"
          >
            <check-circle-outlined class="facility-icon" />
            <span>{{ fac }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="info-section glass-effect" v-if="venue.description">
        <h3 class="section-title">钓场简介</h3>
        <p class="description">{{ venue.description }}</p>
      </div>

      <!-- Pricing -->
      <div class="info-section glass-effect" v-if="pricings.length">
        <h3 class="section-title">收费标准</h3>
        <div class="pricing-list">
          <div v-for="price in pricings" :key="price.id" class="pricing-item">
            <div class="pricing-type">{{ getPricingTypeName(price.type) }}</div>
            <div class="pricing-price">¥{{ price.price }}</div>
            <div class="pricing-unit" v-if="price.unit">{{ price.unit }}</div>
          </div>
        </div>
      </div>

      <!-- Species -->
      <div class="info-section glass-effect" v-if="species.length">
        <h3 class="section-title">鱼种信息</h3>
        <div class="species-list">
          <div v-for="sp in species" :key="sp.id" class="species-item">
            <span class="species-name">{{ sp.name }}</span>
            <span class="species-weight" v-if="sp.avgWeight">约 {{ sp.avgWeight }}斤</span>
            <span class="species-count" v-if="sp.quantity">{{ sp.quantity }}条</span>
          </div>
        </div>
      </div>

      <!-- Fish Info -->
      <div class="info-section glass-effect" v-if="fishInfos.length">
        <h3 class="section-title">最新鱼讯</h3>
        <div class="fish-info-list">
          <div v-for="info in fishInfos" :key="info.id" class="fish-info-item">
            <p class="fish-content">{{ info.content }}</p>
            <div class="fish-meta">
              <span>{{ formatTime(info.createdAt) }}</span>
              <span v-if="info.biteRate"><thunderbolt-outlined /> {{ info.biteRate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action -->
    <div class="bottom-action glass-effect" v-if="venue">
      <a-button type="primary" block size="large" @click="handleFavorite">
        <star-outlined /> {{ isFavorite ? '已收藏' : '收藏钓场' }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { getVenueDetail, fetchPricings, fetchSpecies, fetchFishInfos, addFavorite, removeFavorite, fetchFavorites } from '@/api';
import { useUserStore } from '@/stores/user';
import { 
  LeftOutlined,
  StarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const venue = ref<any>(null);
const pricings = ref<any[]>([]);
const species = ref<any[]>([]);
const fishInfos = ref<any[]>([]);
const isFavorite = ref(false);

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

const getPricingTypeName = (type: string) => {
  const map: Record<string, string> = {
    per_weight: '按斤收费',
    per_day: '按天收费',
    per_hour: '按时收费',
    membership: '会员制',
  };
  return map[type] || type;
};

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

const checkFavorite = async () => {
  if (!userStore.isLoggedIn) return;
  try {
    const res: any = await fetchFavorites();
    const favorites = res.data || res || [];
    isFavorite.value = favorites.some((f: any) => f.venueId === venue.value?.id);
  } catch {
    isFavorite.value = false;
  }
};

const handleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录');
    router.push('/login');
    return;
  }
  try {
    if (isFavorite.value) {
      await removeFavorite(venue.value.id);
      isFavorite.value = false;
      message.success('已取消收藏');
    } else {
      await addFavorite(venue.value.id);
      isFavorite.value = true;
      message.success('收藏成功');
    }
  } catch {
    message.error('操作失败');
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    
    const [venueRes, pricingRes, speciesRes, fishRes] = await Promise.all([
      getVenueDetail(id),
      fetchPricings(id),
      fetchSpecies(id),
      fetchFishInfos({ venueId: id, page: 1, pageSize: 5 }),
    ]);
    
    venue.value = venueRes.data || venueRes;
    pricings.value = pricingRes.data || pricingRes || [];
    species.value = speciesRes.data || speciesRes || [];
    fishInfos.value = fishRes.data?.list || fishRes.list || fishRes.data || [];
    
    await checkFavorite();
  } catch {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.venue-detail-page {
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
}

.header-action {
  padding: 8px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.content-scroll {
  padding: 16px;
}

.venue-cover {
  position: relative;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.venue-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.venue-name-overlay {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.venue-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-open {
  background: #52c41a;
  color: #fff;
}

.status-pending {
  background: #faad14;
  color: #000;
}

.status-offline {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.info-section {
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--glass-border);
  font-size: 14px;
  color: #fff;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row a {
  color: var(--primary-color);
}

.info-icon {
  color: var(--primary-color);
  font-size: 18px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 12px;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.facility-icon {
  color: #52c41a;
}

.description {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.pricing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pricing-item {
  background: rgba(0, 242, 254, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
}

.pricing-type {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.pricing-price {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
}

.pricing-unit {
  font-size: 11px;
  color: var(--text-muted);
}

.species-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.species-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 6px 12px;
}

.species-name {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.species-weight,
.species-count {
  font-size: 12px;
  color: var(--text-muted);
}

.fish-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fish-info-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.fish-content {
  font-size: 14px;
  color: #fff;
  margin: 0 0 8px;
}

.fish-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  z-index: 1000;
}

.bottom-action :deep(.ant-btn-primary) {
  background: var(--primary-color);
  border: none;
}
</style>