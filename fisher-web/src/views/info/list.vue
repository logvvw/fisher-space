<template>
  <div class="info-page">
    <!-- Header -->
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>发现</h1>
    </header>

    <div class="content-scroll">
      <!-- Category Tabs -->
      <div class="category-tabs glass-effect">
        <div 
          v-for="cat in categories" 
          :key="cat.value"
          class="tab-item"
          :class="{ active: activeCategory === cat.value }"
          @click="switchTab(cat.value)"
        >
          {{ cat.label }}
        </div>
      </div>

      <!-- Topics Grid (Topic Tab) -->
      <div class="topics-grid" v-if="activeCategory === 'topics' && !loading">
        <div 
          v-for="topic in topics" 
          :key="topic.id"
          class="topic-card glass-effect"
          @click="goTopicDetail(topic.id)"
        >
          <div class="topic-icon" :style="{ background: topic.color }">
            {{ topic.name?.[0] || 'T' }}
          </div>
          <div class="topic-info">
            <h4 class="topic-name">{{ topic.name }}</h4>
            <p class="topic-desc">{{ topic.description }}</p>
            <div class="topic-meta">
              <span>{{ topic.postCount || 0 }} 帖子</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Encyclopedia Grid (百科 Tab) -->
      <div class="encyclopedia-grid" v-if="activeCategory === 'encyclopedia' && !loading">
        <div 
          v-for="fish in encyclopediaList" 
          :key="fish.id"
          class="fish-card glass-effect"
          @click="goDetail(fish.id)"
        >
          <div class="fish-cover">
            <img :src="fish.cover" :alt="fish.name" />
          </div>
          <div class="fish-info">
            <h4 class="fish-name">{{ fish.name }}</h4>
            <p class="fish-desc">{{ fish.summary }}</p>
            <div class="fish-tags">
              <a-tag v-for="(tag, idx) in fish.tags" :key="idx" color="blue" size="small">{{ tag }}</a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Article List (Other Tabs) -->
      <div class="article-list" v-if="!loading">
        <div 
          v-for="article in articles" 
          :key="article.id"
          class="article-card glass-effect"
          @click="goDetail(article.id)"
        >
          <div class="article-cover" v-if="article.cover">
            <img :src="article.cover" :alt="article.title" />
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary || '暂无简介' }}</p>
            <div class="article-meta">
              <span class="article-category">{{ getCategoryName(article.category) }}</span>
              <span class="article-time">{{ formatTime(article.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && articles.length === 0 && activeCategory !== 'topics'">
        <book-outlined class="empty-icon" />
        <p>暂无文章</p>
      </div>

      <!-- Topic Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && topics.length === 0 && activeCategory === 'topics'">
        <comment-outlined class="empty-icon" />
        <p>暂无话题</p>
      </div>

      <!-- Encyclopedia Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && encyclopediaList.length === 0 && activeCategory === 'encyclopedia'">
        <bulb-outlined class="empty-icon" />
        <p>暂无鱼类百科</p>
      </div>

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <a-spin size="large" />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav glass-effect">
      <div class="nav-item" @click="$router.push('/home')"><home-outlined /><span>首页</span></div>
      <div class="nav-item" @click="$router.push('/fish-info')"><read-outlined /><span>鱼讯</span></div>
      <div class="nav-item active"><appstore-outlined /><span>发现</span></div>
      <div class="nav-item" @click="$router.push('/user/profile')"><user-outlined /><span>我的</span></div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { fetchArticles, fetchTopics } from '@/api';
import { 
  LeftOutlined,
  HomeOutlined,
  ReadOutlined,
  AppstoreOutlined,
  UserOutlined,
  BookOutlined,
  CommentOutlined,
  BulbOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);
const articles = ref<any[]>([]);
const topics = ref<any[]>([]);
const activeCategory = ref('all');

const encyclopediaList = [
  {
    id: 901,
    name: '鲫鱼',
    cover: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&q=80',
    summary: '适应性强，杂食性鱼类，全年可钓',
    tags: ['底层鱼', '杂食性', '全年可钓'],
  },
  {
    id: 902,
    name: '鲤鱼',
    cover: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&q=80',
    summary: '底层杂食，体型健壮，力道十足',
    tags: ['底层鱼', '力道大', '智慧鱼'],
  },
  {
    id: 903,
    name: '草鱼',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    summary: '草食性鱼类，生长迅速，个体大',
    tags: ['中上层', '草食性', '生长快'],
  },
  {
    id: 904,
    name: '青鱼',
    cover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    summary: '肉食性底栖鱼，又称青鲩，力道猛烈',
    tags: ['底层鱼', '肉食性', '力道猛'],
  },
  {
    id: 905,
    name: '白鲢',
    cover: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80',
    summary: '滤食性中上层鱼，生长快，喜跳跃',
    tags: ['中上层', '滤食性', '喜跳跃'],
  },
];

const categories = [
  { label: '全部', value: 'all' },
  { label: '技巧', value: 'technique' },
  { label: '百科', value: 'encyclopedia' },
  { label: '资讯', value: 'news' },
  { label: '话题', value: 'topics' },
];

const getCategoryName = (cat: string) => {
  const map: Record<string, string> = {
    technique: '技巧',
    encyclopedia: '百科',
    news: '资讯',
  };
  return map[cat] || cat;
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

const goDetail = (id: number) => {
  router.push(`/info/${id}`);
};

const goTopicDetail = (id: number) => {
  router.push(`/topic/${id}`);
};

const switchTab = (tab: string) => {
  activeCategory.value = tab;
  if (tab !== 'topics') {
    loadData();
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    if (activeCategory.value === 'topics') {
      const res: any = await fetchTopics({ page: 1, pageSize: 50 });
      topics.value = res.data || res.list || res.data?.list || [];
    } else if (activeCategory.value !== 'encyclopedia') {
      const params: any = { page: 1, pageSize: 20 };
      if (activeCategory.value !== 'all') {
        params.category = activeCategory.value;
      }
      const res: any = await fetchArticles(params);
      articles.value = res.data || res.list || [];
    }
  } catch {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.info-page {
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

.category-tabs {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab-item.active {
  background: var(--primary-color);
  color: #000;
  font-weight: bold;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.article-card:active {
  transform: scale(0.98);
}

.article-cover {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.article-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-summary {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.article-category {
  background: rgba(0, 242, 254, 0.1);
  color: var(--primary-color);
  padding: 2px 8px;
  border-radius: 4px;
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

/* Topics Grid */
.topics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* Encyclopedia Grid */
.encyclopedia-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.fish-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.fish-card:active {
  transform: scale(0.97);
}

.fish-cover {
  height: 100px;
  overflow: hidden;
}

.fish-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fish-info {
  padding: 12px;
}

.fish-name {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px;
}

.fish-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fish-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.topic-card {
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.topic-card:active {
  transform: scale(0.98);
}

.topic-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12px;
}

.topic-info {
  min-width: 0;
}

.topic-name {
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px;
}

.topic-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topic-meta {
  font-size: 11px;
  color: var(--text-muted);
}
</style>