import axios from 'axios';

const BASE_URL = 'https://pet-manager-api.geia.vip';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptador para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador para lidar com erros 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.put(
            `${BASE_URL}/autenticacao/refresh`,
            { refreshToken }
          );
          
          localStorage.setItem('authToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
