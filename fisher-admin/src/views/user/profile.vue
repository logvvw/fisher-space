<template>
  <a-layout-content style="padding: 20px">
    <h2>个人中心</h2>
    <a-card>
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户名">-</a-descriptions-item>
        <a-descriptions-item label="昵称">-</a-descriptions-item>
        <a-descriptions-item label="角色">-</a-descriptions-item>
      </a-descriptions>
      <a-button type="link" @click="$router.push('/user/favorites')">我的收藏</a-button>
    </a-card>
  </a-layout-content>
</template>

<script setup lang="ts">
</script>