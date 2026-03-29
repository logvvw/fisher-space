<template>
  <div class="register-page">
    <a-card style="width: 400px; margin: 100px auto;">
      <h2 style="text-align: center;">注册</h2>
      <a-form :model="form" @finish="onFinish">
        <a-form-item name="username" rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="form.username" placeholder="用户名" />
        </a-form-item>
        <a-form-item name="password" rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="form.password" placeholder="密码" />
        </a-form-item>
        <a-form-item name="role" rules="[{ required: true, message: '请选择角色' }]">
          <a-select v-model:value="form.role" placeholder="选择角色">
            <a-select-option value="angler">垂钓者</a-select-option>
            <a-select-option value="venue_admin">钓场管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>注册</a-button>
        </a-form-item>
      </a-form>
      <div style="text-align: center;">
        <a @click="$router.push('/login')">已有账号？去登录</a>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const form = ref({ username: '', password: '', role: 'angler' });

const onFinish = () => {
  message.success('注册成功，请登录');
  router.push('/login');
};
</script>