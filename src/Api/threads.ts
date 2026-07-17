import { api } from "./Api";
import { Post } from "../Components/Pages/Threads/Threads";

export const threadsAPI = {
  getAll: async (): Promise<Post[]> => {
    return (await api.get('/threads')).data;
  },

  create: async (data: { title: string; content: string }) => {
    return (await api.post('/threads', data)).data;
  },

  like: async (postId: number) => {
    return (await api.post(`/threads/${postId}/like`)).data;
  },

  comment: async (postId: number, text: string) => {
    return (await api.post(`/threads/${postId}/comments`, { text })).data;
  },

  delete: async (postId: number) => {
    return (await api.delete(`/threads/${postId}`)).data;
  },
};