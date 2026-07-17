import { api } from './Api';

export const filmsAPI = {
  getAll: async () => {
    return (await api.get('/films')).data;
  },

  create: async (data: { title: string; genre: string[]; image: string }) => {
    return (await api.post('/films', data)).data;
  },
};