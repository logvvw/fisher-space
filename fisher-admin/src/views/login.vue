<template>
  <div class="login-page">
    <div class="login-container glass-panel">
      <div class="login-header">
        <div class="logo-box">F</div>
        <h2 class="text-gradient">FISHER ADMIN</h2>
        <p class="subtitle">专业的钓场运营管理系统</p>
      </div>
      
      <a-form :model="form" @finish="onFinish" layout="vertical">
        <a-form-item 
          name="username" 
          :rules="[{ required: true, message: '请输入管理员账号' }]"
        >
          <a-input v-model:value="form.username" placeholder="账号">
            <template #prefix><UserOutlined style="color: var(--text-dim)" /></template>
          </a-input>
        </a-form-item>
        <a-form-item 
          name="password" 
          :rules="[{ required: true, message: '请输入登录密码' }]"
        >
          <a-input-password v-model:value="form.password" placeholder="密码">
            <template #prefix><LockOutlined style="color: var(--text-dim)" /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading" class="login-btn">
            安全登录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="login-footer">
        © 2026 Fisher Portal Tech.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { login } from '@/api';

const router = useRouter();
const loading = ref(false);
const form = reactive({ username: '', password: '' });

const onFinish = async () => {
  loading.value = true;
  try {
    const res: any = await login(form);
    const tokenStr = res.token || res.access_token;
    if (tokenStr) {
      localStorage.setItem('admin_token', tokenStr);
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      message.success('登录成功，欢迎回来');
      router.push('/dashboard');
    } else {
      message.error(res.message || '登录失败');
    }
  } catch (err: any) {
    message.error(err.response?.data?.message || '服务器连接异常');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #e0eafc 0%, #cfdef3 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  top: -100px;
  left: -100px;
}

.login-container {
  width: 420px;
  padding: 40px;
  border-radius: 24px;
  z-index: 10;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-box {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--admin-primary), var(--admin-accent));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #fff;
  margin: 0 auto 20px;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.2);
}

.text-gradient {
  background: linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-dim);
  font-size: 14px;
}

.login-btn {
  height: 44px;
  border-radius: 12px;
  font-weight: 600;
  margin-top: 20px;
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  color: var(--text-dim);
  font-size: 12px;
}

:deep(.ant-input-affix-wrapper) {
  height: 44px;
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 12px !important;
}

:deep(.ant-input) {
  color: var(--text-bright) !important;
}
</style>