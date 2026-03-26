import api from './api';
import { parseJwt } from '../utils/helpers';

const AUTH_STORAGE_KEY = 'user';

const authService = {
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  buildUserFromToken(token) {
    const payload = parseJwt(token);

    const role =
      payload?.role ||
      (Array.isArray(payload?.roles) && payload.roles.length > 0 ? payload.roles[0] : 'USER');

    return {
      email: payload?.sub || '',
      role: String(role).replace('ROLE_', ''),
      id: payload?.userId ?? null,
    };
  },

  saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getStoredUser() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  },
};

export default authService;
