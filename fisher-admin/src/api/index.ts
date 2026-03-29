import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 钓场相关 API
export const fetchVenues = (params: any) => {
  return request.get('/venues', { params });
};

export const getVenueDetail = (id: number) => {
  return request.get(`/venues/${id}`);
};

export const createVenue = (data: any) => {
  return request.post('/venues', data);
};

export const updateVenue = (id: number, data: any) => {
  return request.put(`/venues/${id}`, data);
};

export const deleteVenue = (id: number) => {
  return request.delete(`/venues/${id}`);
};

export const approveVenue = (id: number) => {
  return request.put(`/venues/${id}/approve`);
};

export const rejectVenue = (id: number) => {
  return request.put(`/venues/${id}/reject`);
};

export const login = (data: any) => {
  return request.post('/auth/login', data);
};

// 用户相关 API
export const fetchUsers = (params: any) => {
  return request.get('/users', { params });
};

export const createUser = (data: any) => {
  return request.post('/users', data);
};

export const updateUser = (id: number, data: any) => {
  return request.put(`/users/${id}`, data);
};

export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`);
};

// 鱼种相关 API
export const fetchSpecies = (params: any) => {
  return request.get('/species', { params });
};

export const fetchSpeciesStats = () => {
  return request.get('/species/stats');
};

export const createSpecies = (data: any) => {
  return request.post('/species', data);
};

export const updateSpecies = (id: number, data: any) => {
  return request.put(`/species/${id}`, data);
};

export const deleteSpecies = (id: number) => {
  return request.delete(`/species/${id}`);
};

// 钓费相关 API
export const fetchPricings = (params: any) => {
  return request.get('/pricings', { params });
};

export const createPricing = (data: any) => {
  return request.post('/pricings', data);
};

export const updatePricing = (id: number, data: any) => {
  return request.put(`/pricings/${id}`, data);
};

export const deletePricing = (id: number) => {
  return request.delete(`/pricings/${id}`);
};

// 鱼情信息相关 API
export const fetchFishInfos = (params: any) => {
  return request.get('/fish-infos', { params });
};

export const createFishInfo = (data: any) => {
  return request.post('/fish-infos', data);
};

export const updateFishInfo = (id: number, data: any) => {
  return request.put(`/fish-infos/${id}`, data);
};

export const deleteFishInfo = (id: number) => {
  return request.delete(`/fish-infos/${id}`);
};

export const topFishInfo = (id: number) => {
  return request.put(`/fish-infos/${id}/top`);
};

// 文章相关 API
export const fetchArticles = (params: any) => {
  return request.get('/articles', { params });
};

export const getArticleDetail = (id: number) => {
  return request.get(`/articles/${id}`);
};

export const createArticle = (data: any) => {
  return request.post('/articles', data);
};

export const updateArticle = (id: number, data: any) => {
  return request.put(`/articles/${id}`, data);
};

export const deleteArticle = (id: number) => {
  return request.delete(`/articles/${id}`);
};

// Banner相关 API
export const fetchBanners = () => {
  return request.get('/banners');
};

export const createBanner = (data: any) => {
  return request.post('/banners', data);
};

export const updateBanner = (id: number, data: any) => {
  return request.put(`/banners/${id}`, data);
};

export const deleteBanner = (id: number) => {
  return request.delete(`/banners/${id}`);
};

// 投放记录相关 API
export const fetchStockingRecords = (params: any) => {
  return request.get('/stocking', { params });
};

export const createStockingRecord = (data: any) => {
  return request.post('/stocking', data);
};

export const updateStockingRecord = (id: number, data: any) => {
  return request.put(`/stocking/${id}`, data);
};

export const deleteStockingRecord = (id: number) => {
  return request.delete(`/stocking/${id}`);
};

// 生长动态相关 API
export const fetchGrowthRecords = (params: any) => {
  return request.get('/growth', { params });
};

export const createGrowthRecord = (data: any) => {
  return request.post('/growth', data);
};

export const updateGrowthRecord = (id: number, data: any) => {
  return request.put(`/growth/${id}`, data);
};

export const deleteGrowthRecord = (id: number) => {
  return request.delete(`/growth/${id}`);
};

export default request;