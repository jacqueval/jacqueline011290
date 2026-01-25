import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/q',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.put(`${api.defaults.baseURL}/autenticacao/refresh`, { refreshToken });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          error.config.headers.Authorization = `Bearer ${res.data.token}`;
          return axios(error.config);
        } catch {
       
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;