import api from './api';

const userService = {
  async createUser(payload) {
    const { data } = await api.post('/users', payload);
    return data;
  },

  async getUsers() {
    const { data } = await api.get('/users');
    return data;
  },

  async getActiveUsers() {
    const { data } = await api.get('/users/active');
    return data;
  },

  async getUserById(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async deactivateUser(id) {
    const { data } = await api.patch(`/users/${id}/deactivate`);
    return data;
  },

  async activateUser(id) {
    const { data } = await api.patch(`/users/${id}/activate`);
    return data;
  },
};

export default userService;
