<template>
  <a-layout-content style="padding: 20px">
    <h2>我的收藏</h2>
    <a-list :data-source="favorites" :locale="{ emptyText: '暂无收藏' }">
      <template #renderItem="{ item }">
        <a-list-item @click="$router.push(`/venue/${item.id}`)">
          <a-list-item-meta :title="item.name" :description="item.address" />
        </a-list-item>
      </template>
    </a-list>
  </a-layout-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const favorites = ref([
  { id: 1, name: '阳光渔场', address: '北京市朝阳区' },
]);
</script>