import { api } from "./Api";

export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    return (await api.post('/auth/register', data)).data;
  },

  login: async (data: { username: string; password: string }) => {
    return (await api.post('/auth/login', data)).data;
  },

  changePassword: async (newPassword: string) => {
    return (await api.put('/users/password', { newPassword })).data;
  },

  updateProfile: async (data: { name: string; email: string; bio: string; avatar?: string }) => {
    return (await api.put('/users/profile', data)).data;
  },
};