<template>
  <div class="home">
    <a-config-provider>
      <a-layout>
        <a-layout-header class="header">
          <div class="logo">钓鱼门户</div>
          <div class="nav-tabs">
            <a-radio-group v-model:value="activeTab" button-style="solid">
              <a-radio-button value="leisure" @click="switchTab('leisure')">休闲钓</a-radio-button>
              <a-radio-button value="business" @click="switchTab('business')">钓场经营</a-radio-button>
            </a-radio-group>
          </div>
          <div class="user-actions">
            <a-button type="link" @click="$router.push('/login')">登录</a-button>
          </div>
        </a-layout-header>
        <a-layout-content class="content">
          <a-carousel autoplay>
            <div><h3>今日鱼讯：鲫鱼开口好</h3></div>
            <div><h3>新钓场上线：阳光渔场</h3></div>
            <div><h3>春季垂钓大赛火热报名中</h3></div>
          </a-carousel>
          
          <div class="quick-entry">
            <a-grid :gutter="16" :cols="{ xs: 2, sm: 4 }">
              <a-grid-item>
                <a-card hoverable @click="$router.push('/venue/list')">
                  <template #cover>🎣</template>
                  <a-card-meta title="找钓场" />
                </a-card>
              </a-grid-item>
              <a-grid-item>
                <a-card hoverable @click="$router.push('/fish-info')">
                  <template #cover>🐟</template>
                  <a-card-meta title="看鱼讯" />
                </a-card>
              </a-grid-item>
              <a-grid-item>
                <a-card hoverable @click="$router.push('/info/list?category=technique')">
                  <template #cover>📚</template>
                  <a-card-meta title="垂钓学堂" />
                </a-card>
              </a-grid-item>
              <a-grid-item>
                <a-card hoverable @click="$router.push('/info/list?category=encyclopedia')">
                  <template #cover>🐠</template>
                  <a-card-meta title="鱼类百科" />
                </a-card>
              </a-grid-item>
            </a-grid>
          </div>

          <a-divider>精选钓场</a-divider>
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
                      <div>面积: {{ item.area || '-' }}亩</div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>

          <a-divider>最新鱼讯</a-divider>
          <a-list :data-source="fishInfos" :locale="{ emptyText: '暂无鱼讯' }">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <span>{{ item.venue?.name }}</span>
                    <a-tag v-if="item.isTop" color="red">置顶</a-tag>
                  </template>
                  <template #description>
                    <div>{{ item.content }}</div>
                    <div class="meta">{{ item.createdAt }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-layout-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const activeTab = ref('leisure');
const loading = ref(false);
const venues = ref<any[]>([]);
const fishInfos = ref<any[]>([]);

const switchTab = (tab: string) => {
  if (tab === 'business') {
    router.push('/home/business');
  }
};

const goDetail = (id: number) => {
  router.push(`/venue/${id}`);
};

const loadData = async () => {
  loading.value = true;
  try {
    // Mock data for now
    venues.value = [
      { id: 1, name: '阳光渔场', address: '北京市朝阳区', area: 50, coverImage: '' },
      { id: 2, name: '水库垂钓园', address: '北京市海淀区', area: 80, coverImage: '' },
    ];
    fishInfos.value = [
      { id: 1, venue: { name: '阳光渔场' }, content: '今日鲫鱼开口好，已投放500斤', isTop: true, createdAt: '2024-03-28' },
      { id: 2, venue: { name: '水库垂钓园' }, content: '鲤鱼开始活跃，欢迎垂钓', isTop: false, createdAt: '2024-03-27' },
    ];
  } catch (error) {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.home {
  min-height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 20px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
}
.nav-tabs {
  flex: 1;
}
.user-actions {
  text-align: right;
}
.content {
  padding: 20px;
  background: #f5f5f5;
}
.content :deep(.ant-carousel) {
  margin-bottom: 20px;
}
.content :deep(.ant-carousel h3) {
  height: 160px;
  line-height: 160px;
  text-align: center;
  background: #364d79;
  color: #fff;
  margin: 0;
}
.quick-entry {
  margin-bottom: 20px;
}
.quick-entry :deep(.ant-card) {
  text-align: center;
}
.quick-entry :deep(.ant-card-meta-title) {
  font-size: 14px;
}
.meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>