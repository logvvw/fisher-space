import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/home/business',
      name: 'Business',
      component: () => import('@/views/home/business.vue'),
    },
    {
      path: '/venue/list',
      name: 'VenueList',
      component: () => import('@/views/venue/list.vue'),
    },
    {
      path: '/venue/:id',
      name: 'VenueDetail',
      component: () => import('@/views/venue/detail.vue'),
    },
    {
      path: '/fish-info',
      name: 'FishInfo',
      component: () => import('@/views/fish-info/list.vue'),
    },
    {
      path: '/info/list',
      name: 'InfoList',
      component: () => import('@/views/info/list.vue'),
    },
    {
      path: '/info/:id',
      name: 'InfoDetail',
      component: () => import('@/views/info/detail.vue'),
    },
    {
      path: '/topic/:id',
      name: 'TopicDetail',
      component: () => import('@/views/topic/detail.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/user/login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/user/register.vue'),
    },
    {
      path: '/user/profile',
      name: 'Profile',
      component: () => import('@/views/user/profile.vue'),
    },
    {
      path: '/user/favorites',
      name: 'Favorites',
      component: () => import('@/views/user/favorites.vue'),
    },
  ],
});

export default router;