import Cookies from 'js-cookie';
import apiClient from './api';
import { User, LoginCredentials } from '@/types';

const TOKEN_KEY = 'jrf_auth_token';
const TOKEN_EXPIRY_DAYS = 7;

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: TOKEN_EXPIRY_DAYS, secure: true, sameSite: 'strict' });
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const login = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post('/api/auth/login', credentials);
  const { token, user } = response.data;
  setToken(token);
  return { token, user };
};

export const logout = (): void => {
  removeToken();
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};
