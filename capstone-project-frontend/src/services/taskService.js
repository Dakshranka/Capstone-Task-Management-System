import api from './api';

const taskService = {
  async getTasks(filters = {}) {
    const params = {};

    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.assignedTo) {
      params.assignedTo = filters.assignedTo;
    }

    const { data } = await api.get('/tasks', { params });
    return data;
  },

  async getTaskById(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  async createTask(payload) {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  async updateTask(id, payload) {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  },

  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
