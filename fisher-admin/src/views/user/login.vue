<template>
  <div class="login-page">
    <a-card style="width: 400px; margin: 100px auto;">
      <h2 style="text-align: center;">登录</h2>
      <a-form :model="form" @finish="onFinish">
        <a-form-item name="username" rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="form.username" placeholder="用户名" />
        </a-form-item>
        <a-form-item name="password" rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="form.password" placeholder="密码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>
      <div style="text-align: center;">
        <a @click="$router.push('/register')">没有账号？去注册</a>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const form = ref({ username: '', password: '' });

const onFinish = () => {
  message.success('登录成功');
  router.push('/home');
};
</script>