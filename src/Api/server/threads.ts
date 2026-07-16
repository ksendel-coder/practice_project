// src/api/server/threads.ts
const API_URL = '/api';

export interface Comment {
  _id: number;
  author: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  _id: number;
  author: string;
  avatar?: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
}

export const threadsAPI = {
  // 🔹 Получить все посты
  getAll: async (): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/threads`);
    if (!response.ok) throw new Error('Ошибка загрузки постов');
    return response.json();
  },

  // 🔹 Создать пост
  create: async (data: { title: string; content: string }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Ошибка создания поста');
    return response.json();
  },

  // 🔹 Лайкнуть пост
  like: async (postId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Ошибка лайка');
    return response.json();
  },

  // 🔹 Добавить комментарий
  comment: async (postId: number, text: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Ошибка добавления комментария');
    return response.json();
  },

  delete: async (postId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/threads/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Ошибка удаления поста');
    return response.json();
  },
};