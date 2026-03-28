import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

export const videoService = {
  getVideos: (params) => api.get('/videos', { params }),
  getVideo: (id) => api.get(`/videos/${id}`),
  getUserVideos: () => api.get('/videos/my-videos'),
  generateVideo: (data) => api.post('/videos/generate', data),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  getThemes: () => api.get('/videos/themes'),
  getRegions: () => api.get('/videos/regions')
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getCredits: () => api.get('/user/credits'),
  addCredits: (amount) => api.post('/user/credits/add', { amount })
};

export default api;