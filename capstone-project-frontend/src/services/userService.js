import api from './api';

const userService = {
  async getUsers() {
    const { data } = await api.get('/users');
    return data;
  },

  async getUserById(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
};

export default userService;
