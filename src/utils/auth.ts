import type { AuthResponse, LoginData } from '../types';

export const login = async (data: LoginData): Promise<AuthResponse> => {
 
  if (data.username === 'admin' && data.password === 'admin') {
    return {
      token: 'fake-token',
      refreshToken: 'fake-refresh-token',
    };
  } else {
    throw new Error('Credenciais inválidas');
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};