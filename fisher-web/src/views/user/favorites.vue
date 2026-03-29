<template>
  <div class="favorites-page">
    <header class="page-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>我的收藏</h1>
    </header>
    <div class="content-scroll">
      <a-spin v-if="loading" class="loading-spin" />
      <a-list v-else :data-source="favorites" :locale="{ emptyText: '暂无收藏' }">
        <template #renderItem="{ item }">
          <a-list-item @click="$router.push(`/venue/${item.id}`)">
            <a-list-item-meta :title="item.name" :description="item.address" />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { fetchFavorites } from '@/api';

const favorites = ref<any[]>([]);
const loading = ref(false);

const loadFavorites = async () => {
  loading.value = true;
  try {
    const data = await fetchFavorites();
    favorites.value = data.map((item: any) => ({
      id: item.venueId,
      name: item.venue?.name || `钓场 #${item.venueId}`,
      address: item.venue?.address || '',
    }));
  } catch (e) {
    favorites.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadFavorites);
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
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
  padding: 20px;
}

.loading-spin {
  display: block;
  margin: 40px auto;
}

:deep(.ant-list-item) {
  color: #fff;
}

:deep(.ant-list-item-meta-title) {
  color: #fff !important;
}

:deep(.ant-list-item-meta-description) {
  color: var(--text-muted) !important;
}
</style>
