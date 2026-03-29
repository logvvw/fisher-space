<template>
  <div class="topic-detail-page">
    <!-- Header -->
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>{{ topicName }}</h1>
    </header>

    <div class="content-scroll">
      <!-- Topic Info -->
      <div class="topic-info-section glass-effect">
        <div class="topic-icon large" :style="{ background: topicColor }">
          {{ topicName?.[0] || 'T' }}
        </div>
        <div class="topic-meta">
          <h2>{{ topicName }}</h2>
          <p>{{ postCount }} 帖子</p>
        </div>
      </div>

      <!-- Post List -->
      <div class="post-list">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="post-card glass-effect"
        >
          <div class="post-header">
            <div class="post-avatar">{{ post.userName?.[0] || 'U' }}</div>
            <div class="post-user">
              <span class="user-name">{{ post.userName }}</span>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
          </div>
          <p class="post-content">{{ post.content }}</p>
          <div class="post-images" v-if="post.images && post.images.length">
            <img v-for="(img, idx) in post.images.slice(0, 3)" :key="idx" :src="img" alt="img" />
          </div>
          <div class="post-actions">
            <span><like-outlined /> {{ post.likeCount || 0 }}</span>
            <span><message-outlined /> {{ post.commentCount || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-effect" v-if="!loading && posts.length === 0">
        <comment-outlined class="empty-icon" />
        <p>暂无帖子</p>
      </div>

      <!-- Loading -->
      <div class="loading-state" v-if="loading">
        <a-spin size="large" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { getTopicDetail } from '@/api';
import { 
  LeftOutlined,
  LikeOutlined,
  MessageOutlined,
  CommentOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const loading = ref(false);
const topicName = ref('话题');
const topicColor = ref('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
const postCount = ref(0);
const posts = ref<any[]>([]);

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

const loadData = async () => {
  loading.value = true;
  try {
    const topicId = route.params.id;
    const res: any = await getTopicDetail(Number(topicId));
    const topic = res.data || res;
    topicName.value = topic.name || '话题';
    topicColor.value = topic.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    postCount.value = topic.postCount || 0;
    // For now, show mock posts until we have a posts API
    posts.value = [];
  } catch {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.topic-detail-page {
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

.topic-info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
}

.topic-icon.large {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}

.topic-meta h2 {
  font-size: 20px;
  color: #fff;
  margin: 0 0 4px;
}

.topic-meta p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  padding: 16px;
  border-radius: 16px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.post-user {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.post-time {
  font-size: 12px;
  color: var(--text-muted);
}

.post-content {
  font-size: 15px;
  color: #fff;
  line-height: 1.6;
  margin: 0 0 12px;
}

.post-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.post-images img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--text-muted);
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
</style>