<template>
  <div class="venue-detail">
    <a-layout-content style="padding: 20px">
      <a-button @click="$router.back()">返回</a-button>
      <h1>钓场详情 - ID: {{ id }}</h1>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id;
</script>