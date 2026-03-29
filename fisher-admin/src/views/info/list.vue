<template>
  <a-layout-content style="padding: 20px">
    <h2>资讯列表</h2>
    <a-list :data-source="articles">
      <template #renderItem="{ item }">
        <a-list-item @click="$router.push(`/info/${item.id}`)">
          <a-list-item-meta :title="item.title" :description="item.summary" />
        </a-list-item>
      </template>
    </a-list>
  </a-layout-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const articles = ref([
  { id: 1, title: '春季钓鱼技巧大全', summary: '掌握这些技巧，爆护很简单' },
  { id: 2, title: '鲫鱼的生活习性', summary: '了解鲫鱼，钓得更准' },
]);
</script>