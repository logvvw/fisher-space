<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="text-gradient">个人中心</h2>
        <p class="subtitle">管理您的个人资料与账号安全设置</p>
      </div>
    </div>

    <a-row :gutter="24">
      <a-col :span="8">
        <a-card class="glass-panel profile-card">
          <div class="avatar-section">
            <a-avatar 
              :size="110" 
              :src="userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username || 'Admin'}`" 
              class="profile-avatar"
            />
            <h3 class="username">{{ userInfo.nickname || userInfo.username || 'Administrator' }}</h3>
            <p class="role-text">{{ getRoleName(userInfo.role) }}</p>
          </div>
          <a-divider style="border-color: rgba(255,255,255,0.1); margin: 16px 0;" />
          <ul class="info-list">
            <li><span class="label">用户名：</span> <span class="value">{{ userInfo.username || '-' }}</span></li>
            <li><span class="label">手机号：</span> <span class="value">{{ userInfo.phone || '未设置' }}</span></li>
            <li><span class="label">电子邮箱：</span> <span class="value">{{ userInfo.email || '未设置' }}</span></li>
            <li><span class="label">注册时间：</span> <span class="value">{{ (userInfo.createdAt || '').slice(0, 10) || '-' }}</span></li>
          </ul>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card class="glass-panel settings-card" title="基本信息设置">
          <a-form 
            :model="formState" 
            layout="vertical"
            @finish="handleSave"
            class="profile-form"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="显示昵称" name="nickname">
                  <a-input v-model:value="formState.nickname" placeholder="请输入前台显示的昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="手机号码" name="phone">
                  <a-input v-model:value="formState.phone" placeholder="请输入联系手机号码" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="电子邮箱" name="email">
                  <a-input v-model:value="formState.email" placeholder="请输入有效邮箱" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="头像地址 (URL)" name="avatar">
                  <a-input v-model:value="formState.avatar" placeholder="可输入公网图片地址" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="saving" class="save-btn">
                保存修改
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { updateUser } from '@/api';

const userInfo = ref<any>({});
const formState = reactive({
  id: undefined,
  nickname: '',
  phone: '',
  email: '',
  avatar: ''
});
const saving = ref(false);

const getRoleName = (role: string) => {
  const map: any = {
    super_admin: '超级管理员',
    venue_admin: '钓场管理员',
    angler: '普通钓客'
  };
  return map[role] || role;
};

onMounted(() => {
  const userStr = localStorage.getItem('admin_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userInfo.value = user;
      
      formState.id = user.id;
      formState.nickname = user.nickname || '';
      formState.phone = user.phone || '';
      formState.email = user.email || '';
      formState.avatar = user.avatar || '';
    } catch {
      // ignore
    }
  }
});

const handleSave = async () => {
  if (!formState.id) {
    message.error('无法获取当前用户信息');
    return;
  }
  
  saving.value = true;
  try {
    const payload = {
      nickname: formState.nickname,
      phone: formState.phone,
      email: formState.email,
      avatar: formState.avatar
    };
    
    // 调用更新用户接口
    await updateUser(formState.id, payload);
    
    // 更新本地缓存
    const updatedUser = { ...userInfo.value, ...payload };
    localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    userInfo.value = updatedUser;
    
    message.success('个人资料更新成功');
    // 强制刷新当前页面以同步全局头像（App.vue）
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } catch (error) {
    message.error('保存失败，请检查网络或重试');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  animation: fadeIn 0.5s ease-out;
  padding: 8px 4px;
}

.page-header {
  margin-bottom: 24px;
}

.text-gradient {
  background: linear-gradient(135deg, #fff 0%, var(--admin-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  color: var(--text-dim);
  font-size: 14px;
}

.profile-card, .settings-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:deep(.ant-card-head) {
  border-bottom: 1px solid var(--glass-border) !important;
  color: var(--text-bright);
  font-weight: 600;
  font-size: 16px;
}

.avatar-section {
  text-align: center;
  padding: 24px 0 12px;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  margin-bottom: 16px;
  background: var(--admin-bg);
}

.username {
  color: var(--text-bright);
  font-size: 22px;
  margin-bottom: 6px;
  font-weight: bold;
}

.role-text {
  color: var(--admin-primary);
  font-size: 14px;
  background: rgba(0, 242, 254, 0.1);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 242, 254, 0.2);
}

.info-list {
  list-style: none;
  padding: 0 12px;
  margin: 0;
}

.info-list li {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px dashed rgba(255,255,255,0.08);
  font-size: 14px;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list .label {
  color: var(--text-dim);
}

.info-list .value {
  color: var(--text-bright);
  font-weight: 500;
}

.profile-form {
  padding-top: 12px;
}

.save-btn {
  width: 130px;
  height: 42px;
  border-radius: 20px;
  margin-top: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
