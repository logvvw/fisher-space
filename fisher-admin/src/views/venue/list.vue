<template>
  <div class="venue-list">
    <a-config-provider>
      <a-layout>
        <a-layout-header>
          <a-button @click="$router.back()">返回</a-button>
          <span>钓场列表</span>
        </a-layout-header>
        <a-layout-content>
          <a-spin :spinning="loading">
            <a-list :data-source="venues" :locale="{ emptyText: '暂无钓场' }">
              <template #renderItem="{ item }">
                <a-list-item @click="goDetail(item.id)">
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :src="item.coverImage" :size="80" shape="square" />
                    </template>
                    <template #title>{{ item.name }}</template>
                    <template #description>
                      <div>{{ item.address }}</div>
                      <div>面积: {{ item.area }}亩</div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const venues = ref([]);

const goDetail = (id: number) => {
  router.push(`/venue/${id}`);
};

onMounted(() => {
  venues.value = [
    { id: 1, name: '阳光渔场', address: '北京市朝阳区', area: 50 },
  ];
});
</script>