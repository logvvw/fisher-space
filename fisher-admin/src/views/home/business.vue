<template>
  <div class="business-home">
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
          <a-page-header title="钓场经营" sub-title="养护知识、经营案例、科学养殖" />
          
          <a-tabs v-model:activeKey="activeCategory">
            <a-tab-pane key="maintenance" tab="养护知识">
              <a-list :data-source="maintenanceArticles" :locale="{ emptyText: '暂无内容' }">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="item.summary" />
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="business" tab="经营案例">
              <a-list :data-source="businessArticles" :locale="{ emptyText: '暂无内容' }">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="item.summary" />
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="tech" tab="科学养殖">
              <a-list :data-source="techArticles" :locale="{ emptyText: '暂无内容' }">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="item.summary" />
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('business');
const activeCategory = ref('maintenance');

const switchTab = (tab: string) => {
  if (tab === 'leisure') {
    router.push('/home');
  }
};

const maintenanceArticles = ref([
  { id: 1, title: '春季鱼塘水质管理要点', summary: '开春水温回升，详解水质调控技巧' },
  { id: 2, title: '鱼类疾病预防与治疗', summary: '常见鱼病识别与防治方法' },
]);

const businessArticles = ref([
  { id: 3, title: '钓场引流获客实战案例', summary: '从0到1打造人气钓场' },
  { id: 4, title: '会员体系设计思路', summary: '提升复购率的秘诀' },
]);

const techArticles = ref([
  { id: 5, title: '科学投喂与生长周期管理', summary: '提高养殖效益的关键技术' },
  { id: 6, title: '水质监测与智能化设备', summary: '现代渔业的科技应用' },
]);
</script>

<style scoped>
.business-home {
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
</style>