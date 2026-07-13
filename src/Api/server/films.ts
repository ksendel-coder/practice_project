const API_URL = '/api';

export const filmsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/films`);
    return response.json();
  },

  create: async (data: { title: string; genre: string[]; image: string }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/films`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};