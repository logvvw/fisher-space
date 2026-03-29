import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const res = error.response?.data;
    return Promise.reject(res || error);
  }
);

export const login = (data: { username: string; password: string }) =>
  request.post('/auth/login', data);

export const register = (data: {
  username: string;
  password: string;
  phone?: string;
  nickname?: string;
}) => request.post('/auth/register', data);

export const getProfile = () => request.get('/auth/profile');

export const updateProfile = (data: {
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  gender?: string;
  province?: string;
  city?: string;
}) => request.put('/auth/profile', data);

export const fetchVenues = (params?: any) => request.get('/venues', { params });

export const getVenueDetail = (id: number) => request.get(`/venues/${id}`);

export const fetchSpecies = (venueId: number) =>
  request.get('/species', { params: { venueId } });

export const fetchPricings = (venueId: number) =>
  request.get('/pricings', { params: { venueId } });

export const fetchFishInfos = (params?: any) =>
  request.get('/fish-infos', { params });

export const fetchArticles = (params?: any) =>
  request.get('/articles', { params });

export const getArticleDetail = (id: number) => request.get(`/articles/${id}`);

export const fetchBanners = (position?: string) =>
  request.get('/banners', { params: { position } });

export const addFavorite = (venueId: number) =>
  request.post('/favorites', { venueId });

export const removeFavorite = (venueId: number) =>
  request.delete(`/favorites/${venueId}`);

export const fetchFavorites = () => request.get('/favorites');

export const fetchTopics = (params?: any) => request.get('/topics', { params });

export const getTopicDetail = (id: number) => request.get(`/topics/${id}`);

export default request;