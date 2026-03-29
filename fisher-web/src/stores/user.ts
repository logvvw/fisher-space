import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, getProfile, updateProfile as apiUpdateProfile } from '@/api';

interface User {
  id: number;
  username: string;
  nickname?: string;
  phone?: string;
  role: string;
  avatar?: string;
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref<User | null>(null);

  const isLoggedIn = computed(() => !!token.value);

  const login = async (username: string, password: string) => {
    const res = await apiLogin({ username, password });
    const loginData = res.data || res;
    const t = loginData.token || res.token;
    const u = loginData.user || res.user;
    if (t) {
      token.value = t;
      localStorage.setItem('token', t);
      userInfo.value = u;
      return true;
    }
    throw new Error(res.message || '登录失败');
  };

  const logout = () => {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    try {
      const res = await getProfile();
      const data = res.data || res;
      if (data) {
        userInfo.value = data;
      }
    } catch {
      logout();
    }
  };

  const updateProfile = async (profileData: any) => {
    const res = await apiUpdateProfile(profileData);
    const result = res.data || res;
    if (result) {
      userInfo.value = { ...userInfo.value, ...result };
    }
    return res;
  };

  return { token, userInfo, isLoggedIn, login, logout, fetchProfile, updateProfile };
});