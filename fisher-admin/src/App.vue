<template>
  <a-layout class="admin-layout">
    <!-- Sider with Glass Effect -->
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      :trigger="null" 
      collapsible
      width="240"
      class="glass-sider"
    >
      <div class="logo-container">
        <div class="logo-box">F</div>
        <span v-if="!collapsed" class="logo-text">FISHER ADMIN</span>
      </div>
      <a-menu 
        v-model:selectedKeys="selectedKeys" 
        mode="inline" 
        class="admin-menu"
        @click="handleMenu"
      >
        <a-menu-item key="/dashboard">
          <template #icon><DashboardOutlined /></template>
          <span>仪表盘</span>
        </a-menu-item>
        <a-menu-item key="/system/users">
          <template #icon><UserOutlined /></template>
          <span>用户管理</span>
        </a-menu-item>
        
        <a-menu-divider />
        
        <a-menu-item key="/venue/approve">
          <template #icon><CheckCircleOutlined /></template>
          <span>钓场审核</span>
        </a-menu-item>
        <a-menu-item key="/venue/manage">
          <template #icon><ShopOutlined /></template>
          <span>钓场管理</span>
        </a-menu-item>

        <!-- 鱼群控制 SubMenu -->
        <a-sub-menu key="/fish">
          <template #icon><FireOutlined /></template>
          <template #title>鱼群控制</template>
          <a-menu-item key="/fish/stats">鱼类统计</a-menu-item>
          <a-menu-item key="/fish/species">品种维护</a-menu-item>
          <a-menu-item key="/fish/stocking">投放记录</a-menu-item>
          <a-menu-item key="/fish/growth">生长动态</a-menu-item>
        </a-sub-menu>

        <a-menu-item key="/fish/pricing">
          <template #icon><DollarOutlined /></template>
          <span>定价策略</span>
        </a-menu-item>
        
        <a-menu-divider />
        
        <a-menu-item key="/fish-info/publish">
          <template #icon><MessageOutlined /></template>
          <span>鱼讯发布</span>
        </a-menu-item>
        <a-menu-item key="/content/articles">
          <template #icon><FileTextOutlined /></template>
          <span>内容聚合</span>
        </a-menu-item>
        <a-menu-item key="/content/banners">
          <template #icon><PictureOutlined /></template>
          <span>视觉运营</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout class="main-body">
      <!-- Header with Glass Effect -->
      <a-layout-header class="admin-header">
        <div class="header-left">
          <a-button type="text" class="trigger-btn" @click="collapsed = !collapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
        </div>
        <div class="header-right">
          <a-space size="middle">
            <a-badge count="5" dot v-if="isLoggedIn">
              <BellOutlined class="header-icon" />
            </a-badge>
            <a-dropdown v-if="isLoggedIn">
              <div class="user-profile">
                <a-avatar :src="userInfo?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo?.username || 'Admin'}`" />
                <span class="user-name">{{ userInfo?.nickname || userInfo?.username || 'Administrator' }}</span>
              </div>
              <template #overlay>
                <a-menu @click="handleDropdownMenu">
                  <a-menu-item key="profile">个人中心</a-menu-item>
                  <a-menu-item key="settings">系统设置</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout">
                    <span style="color: #ff4d4f">退出登录</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <div v-else class="user-profile" @click="router.push('/login')">
              <a-avatar>
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="user-name">去登录</span>
            </div>
          </a-space>
        </div>
      </a-layout-header>

      <!-- Content Area -->
      <a-layout-content class="admin-content">
        <div class="view-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  DashboardOutlined, UserOutlined, CheckCircleOutlined, ShopOutlined,
  FireOutlined, DollarOutlined, MessageOutlined, FileTextOutlined, PictureOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const selectedKeys = ref<string[]>([route.path]);
const userInfo = ref<any>({});

const isLoggedIn = computed(() => {
  return !!userInfo.value?.username;
});

onMounted(() => {
  checkLoginState();
});

const checkLoginState = () => {
  const userStr = localStorage.getItem('admin_user');
  if (userStr) {
    try {
      userInfo.value = JSON.parse(userStr);
    } catch {
      // do nothing
    }
  } else {
    userInfo.value = {};
  }
};

watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath];
  checkLoginState();
});

const handleMenu = ({ key }: { key: string }) => {
  router.push(key);
};

const handleDropdownMenu = ({ key }: { key: string }) => {
  if (key === 'profile') {
    router.push('/system/profile');
  } else if (key === 'logout') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    userInfo.value = {};
    router.push('/login');
  }
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-box {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--admin-primary), var(--admin-accent));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.logo-text {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-bright);
  white-space: nowrap;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.trigger-btn {
  color: var(--text-bright);
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-dim);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: background 0.3s;
}

.user-profile:hover {
  background: var(--glass-bg);
}

.user-name {
  color: var(--text-bright);
  font-size: 14px;
}

.admin-content {
  padding: 24px;
  overflow-y: auto;
}

.view-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Animations */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>