<template>
  <a-layout-content style="padding: 20px">
    <a-button @click="$router.back()">返回</a-button>
    <h1>资讯详情 - ID: {{ id }}</h1>
  </a-layout-content>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id;
</script>