// store/medicalHistoryPaginationStore.js
import { create } from "zustand";
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.1:3000/api";

const useMedicalHistoryPaginationStore = create((set, get) => ({
  histories: [],
  offset: 0,
  limit: 100,
  hasMore: true,
  loading: false,
  total: 0,

  fetchMoreHistories: async () => {
    const { offset, limit, hasMore, loading, histories } = get();
    if (!hasMore || loading) return;

    set({ loading: true });

    try {
      const response = await api.get(`${API_URL}/histories?limit=${limit}&offset=${offset}`);
      // console.log(response.data);
      const newHistories = response.data.data || [];

      set({        
        histories: [
          ...histories,
          ...newHistories.filter(h => !histories.some(e => e.id === h.id))
        ],
        offset: offset + limit,
        hasMore: response.data.hasMore ?? newHistories.length === limit,
        total: response.data.total ?? get().total,
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error al cargar historias clínicas:", error);
      set({ loading: false });
    }
  },
  updateOneHistory: (updatedHistory) => {
    set((state) => ({
      histories: state.histories.map((h) =>
        h.id === updatedHistory.id ? updatedHistory : h
      ),
    }));
  },

  resetPagination: () => {
    set({
      histories: [],
      offset: 0,
      hasMore: true,
      total: 0,
    });
  },
}));

export default useMedicalHistoryPaginationStore;
