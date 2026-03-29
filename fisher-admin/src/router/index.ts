import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index.vue'),
    },
    {
      path: '/system/users',
      name: 'UserManage',
      component: () => import('@/views/system/user-manage.vue'),
    },
    {
      path: '/system/profile',
      name: 'UserProfile',
      component: () => import('@/views/system/profile.vue'),
    },
    {
      path: '/venue/approve',
      name: 'VenueApprove',
      component: () => import('@/views/venue/approve.vue'),
    },
    {
      path: '/venue/manage',
      name: 'VenueManage',
      component: () => import('@/views/venue/manage.vue'),
    },
    {
      path: '/fish/stats',
      name: 'StatsManage',
      component: () => import('@/views/fish/stats.vue'),
    },
    {
      path: '/fish/species',
      name: 'SpeciesManage',
      component: () => import('@/views/fish/species.vue'),
    },
    {
      path: '/fish/stocking',
      name: 'StockingManage',
      component: () => import('@/views/fish/stocking.vue'),
    },
    {
      path: '/fish/growth',
      name: 'GrowthManage',
      component: () => import('@/views/fish/growth.vue'),
    },
    {
      path: '/fish/pricing',
      name: 'PricingManage',
      component: () => import('@/views/fish/pricing.vue'),
    },
    {
      path: '/fish-info/publish',
      name: 'FishInfoPublish',
      component: () => import('@/views/fish-info/publish.vue'),
    },
    {
      path: '/content/articles',
      name: 'ArticleManage',
      component: () => import('@/views/content/articles.vue'),
    },
    {
      path: '/content/banners',
      name: 'BannerManage',
      component: () => import('@/views/content/banners.vue'),
    },
  ],
});

export default router;