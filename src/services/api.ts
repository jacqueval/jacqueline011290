import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/q/swagger-ui/', // Gerenciador de Pets API
});
