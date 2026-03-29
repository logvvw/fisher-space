<template>
  <div class="profile-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <a-spin size="large" />
    </div>

    <!-- Header -->
    <div class="profile-header glass-effect">
      <div class="back-btn" @click="$router.back()">
        <left-outlined />
      </div>
      <h1>{{ isEditing ? '编辑资料' : '个人中心' }}</h1>
      <div class="header-action" v-if="!isEditing && userStore.isLoggedIn">
        <edit-outlined @click="startEdit" />
      </div>
    </div>

    <!-- User Info Card -->
    <div class="user-card glass-effect" v-if="userStore.isLoggedIn && userStore.userInfo">
      <template v-if="!isEditing">
        <!-- View Mode -->
        <div class="avatar-section">
          <div class="avatar">
            <img v-if="formData.avatar" :src="formData.avatar" alt="avatar" />
            <span v-else>{{ formData.nickname?.[0] || formData.username?.[0] || 'U' }}</span>
          </div>
          <div class="user-info">
            <h2>{{ formData.nickname || formData.username }}</h2>
            <p>@{{ formData.username }}</p>
            <a-tag :color="getRoleColor(formData.role)">{{ getRoleText(formData.role) }}</a-tag>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- Edit Mode -->
        <a-form :model="formData" layout="vertical">
          <div class="edit-avatar">
            <div class="avatar large">
              <img v-if="formData.avatar" :src="formData.avatar" alt="avatar" />
              <span v-else>{{ formData.nickname?.[0] || formData.username?.[0] || 'U' }}</span>
            </div>
          </div>
          <a-form-item label="头像URL">
            <a-input v-model:value="formData.avatar" placeholder="输入头像图片URL" />
          </a-form-item>
          <a-form-item label="昵称">
            <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="性别">
            <a-radio-group v-model:value="formData.gender">
              <a-radio value="male">男</a-radio>
              <a-radio value="female">女</a-radio>
              <a-radio value="secret">保密</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="手机号">
            <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item label="地区">
            <a-cascader
              v-model:value="regionValue"
              :options="regionOptions"
              placeholder="请选择省/市/区"
              @change="handleRegionChange"
              change-on-select
            />
          </a-form-item>
        </a-form>
      </template>
    </div>

    <!-- Not Logged In -->
    <div class="not-login glass-effect" v-else>
      <user-outlined class="login-icon" />
      <p>尚未登录</p>
      <a-button type="primary" @click="$router.push('/login')">立即登录</a-button>
    </div>

    <!-- Action Buttons (Edit Mode) -->
    <div class="action-btns glass-effect" v-if="isEditing">
      <a-button @click="cancelEdit">取消</a-button>
      <a-button type="primary" :loading="saving" @click="saveProfile">保存</a-button>
    </div>

    <!-- Menu List -->
    <div class="menu-list glass-effect" v-if="!isEditing">
      <div class="menu-item" @click="$router.push('/user/favorites')">
        <div class="menu-item-left">
          <star-outlined class="menu-icon" />
          <span>我的收藏</span>
        </div>
        <right-outlined class="arrow" />
      </div>
      <div class="menu-item no-arrow">
        <div class="menu-item-left">
          <phone-outlined class="menu-icon" />
          <span class="menu-label">手机号</span>
        </div>
        <span class="menu-value">{{ formData.phone || '未填写' }}</span>
      </div>
      <div class="menu-item no-arrow">
        <div class="menu-item-left">
          <mail-outlined class="menu-icon" />
          <span class="menu-label">邮箱</span>
        </div>
        <span class="menu-value">{{ formData.email || '未填写' }}</span>
      </div>
      <div class="menu-item no-arrow">
        <div class="menu-item-left">
          <environment-outlined class="menu-icon" />
          <span class="menu-label">地区</span>
        </div>
        <span class="menu-value">{{ regionText }}</span>
      </div>
      <div class="menu-item" v-if="userStore.isLoggedIn" @click="handleLogout">
        <div class="menu-item-left">
          <logout-outlined class="menu-icon" />
          <span>退出登录</span>
        </div>
        <right-outlined class="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';
import { 
  LeftOutlined,
  UserOutlined,
  StarOutlined,
  LogoutOutlined,
  RightOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue';
import divisionsData from '@/data/divisions.json';

const router = useRouter();
const userStore = useUserStore();

const isEditing = ref(false);
const saving = ref(false);

const formData = ref<any>({
  username: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  gender: 'secret',
  province: '',
  city: '',
  district: '',
  role: '',
});

const regionValue = ref<string[]>([]);
const regionOptions = ref<any[]>([]);

const regionText = computed(() => {
  const parts = [formData.value.province, formData.value.city, formData.value.district].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '未填写';
});

const buildRegionOptions = () => {
  const { provinces, cities, areas } = divisionsData as any;
  
  const citiesByProvince = new Map<string, any[]>();
  const areasByCity = new Map<string, any[]>();
  
  cities.forEach((city: any) => {
    const provinceCode = city.code.slice(0, 2);
    if (!citiesByProvince.has(provinceCode)) {
      citiesByProvince.set(provinceCode, []);
    }
    citiesByProvince.get(provinceCode)!.push(city);
  });
  
  areas.forEach((area: any) => {
    const cityCode = area.code.slice(0, 4);
    if (!areasByCity.has(cityCode)) {
      areasByCity.set(cityCode, []);
    }
    areasByCity.get(cityCode)!.push(area);
  });
  
  regionOptions.value = provinces.map((province: any) => ({
    value: province.code,
    label: province.name,
    children: (citiesByProvince.get(province.code) || []).map((city: any) => ({
      value: city.code,
      label: city.name,
      children: (areasByCity.get(city.code) || []).map((area: any) => ({
        value: area.code,
        label: area.name,
      })),
    })),
  }));
};

const handleRegionChange = (value: string[]) => {
  const provinceCode = value[0];
  const cityCode = value[1];
  const districtCode = value[2];
  
  const { provinces, cities, areas } = divisionsData as any;
  
  const province = provinces.find((p: any) => p.code === provinceCode);
  const city = cities.find((c: any) => c.code === cityCode);
  const area = areas.find((a: any) => a.code === districtCode);
  
  formData.value.province = province?.name || '';
  formData.value.city = city?.name || '';
  formData.value.district = area?.name || '';
};

const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    super_admin: 'purple',
    venue_admin: 'blue',
    angler: 'green',
  };
  return map[role] || 'default';
};

const getRoleText = (role: string) => {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    venue_admin: '钓场管理员',
    angler: '钓客',
  };
  return map[role] || role;
};

const initFormData = () => {
  formData.value = {
    username: userStore.userInfo?.username || '',
    nickname: userStore.userInfo?.nickname || '',
    phone: userStore.userInfo?.phone || '',
    email: userStore.userInfo?.email || '',
    avatar: userStore.userInfo?.avatar || '',
    gender: userStore.userInfo?.gender || 'secret',
    province: userStore.userInfo?.province || '',
    city: userStore.userInfo?.city || '',
    district: userStore.userInfo?.district || '',
    role: userStore.userInfo?.role || '',
  };
  
  if (formData.value.province) {
    const { provinces, cities, areas } = divisionsData as any;
    
    const province = provinces.find((p: any) => p.name === formData.value.province);
    if (province && formData.value.city) {
      const city = cities.find((c: any) => c.name === formData.value.city && c.code.startsWith(province.code.slice(0, 2)));
      if (city) {
        regionValue.value = [province.code, city.code];
        if (formData.value.district) {
          const area = areas.find((a: any) => a.name === formData.value.district && a.code.startsWith(city.code.slice(0, 4)));
          if (area) {
            regionValue.value.push(area.code);
          }
        }
      }
    }
  }
};

const startEdit = () => {
  initFormData();
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveProfile = async () => {
  saving.value = true;
  try {
    await userStore.updateProfile({
      nickname: formData.value.nickname,
      phone: formData.value.phone,
      email: formData.value.email,
      avatar: formData.value.avatar,
      gender: formData.value.gender,
      province: formData.value.province,
      city: formData.value.city,
      district: formData.value.district,
    });
    message.success('保存成功');
    isEditing.value = false;
  } catch (error: any) {
    message.error(error.message || '保存失败');
  } finally {
    saving.value = false;
  }
};

const handleLogout = () => {
  userStore.logout();
  message.success('已退出登录');
  router.push('/home');
};

const loading = ref(false);

onMounted(async () => {
  buildRegionOptions();
  loading.value = true;
  try {
    if (userStore.isLoggedIn) {
      await userStore.fetchProfile();
    }
    initFormData();
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
  padding-bottom: 40px;
}

.profile-header {
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

.profile-header h1 {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #fff;
  margin: 0;
}

.header-action {
  font-size: 18px;
  color: var(--primary-color);
  cursor: pointer;
  padding: 8px;
}

.user-card {
  margin: 20px;
  padding: 24px;
  border-radius: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #000;
  overflow: hidden;
}

.avatar.large {
  width: 96px;
  height: 96px;
  font-size: 36px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h2 {
  font-size: 20px;
  color: #fff;
  margin: 0 0 4px;
}

.user-info p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 8px;
}

.edit-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-cascader) {
  width: 100%;
}

.action-btns {
  display: flex;
  gap: 16px;
  margin: 20px;
  padding: 16px;
  border-radius: 20px;
}

.action-btns :deep(.ant-btn) {
  flex: 1;
}

.not-login {
  margin: 20px;
  padding: 40px 20px;
  border-radius: 20px;
  text-align: center;
}

.login-icon {
  font-size: 48px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.not-login p {
  color: var(--text-muted);
  margin-bottom: 20px;
}

.menu-list {
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: rgba(255, 255, 255, 0.05);
}

.menu-icon {
  font-size: 20px;
  color: var(--primary-color);
  margin-right: 16px;
  width: 20px;
  text-align: center;
}

.menu-item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.menu-label {
  color: #fff;
  min-width: 60px;
}

.menu-item > .menu-value {
  color: var(--text-muted);
  font-size: 14px;
}

.menu-item.no-arrow {
  justify-content: space-between;
}

.menu-item.no-arrow .menu-icon {
  margin-right: 16px;
}

.arrow {
  color: var(--text-muted);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
</style>