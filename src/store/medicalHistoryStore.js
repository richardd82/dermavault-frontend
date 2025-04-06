// store/medicalHistoryStore.js
import { create } from 'zustand';
import api from '../hooks/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useMedicalHistoryStore = create((set, get) => ({
  histories: [],
  loading: false,
  error: null,

  getHistories: async () => {
    try {
      set({ loading: true });
      const res = await api.get(`${API_URL}/histories`);
      set({ histories: res.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createHistory: async (data) => {
    const res = await api.post(`${API_URL}/histories/create`, data);
    get().getHistories(); // Refresh
    return res.data;
  },

  updateHistory: async (id, data) => {
    const res = await api.put(`${API_URL}/histories/${id}`, data);
    get().getHistories(); // Refresh
    return res.data;
  },

  deleteHistory: async (id) => {
    await api.delete(`${API_URL}/histories/${id}`);
    set((state) => ({
      histories: state.histories.filter((h) => h.id !== id),
    }));
  },

  searchHistories: async (query) => {
    if (!query || query.length < 2) return;
    try {
      const res = await api.get(`${API_URL}/histories/search?q=${query}`);
      set({ histories: res.data.data });
    } catch (error) {
      console.error("Error buscando historias:", error);
    }
  }
}));

export default useMedicalHistoryStore;
