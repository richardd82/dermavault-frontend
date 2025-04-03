// store/searchStore.js
import { create } from 'zustand';
import api from '../hooks/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useSearchStore = create((set) => ({
  query: '',
  results: [],
  loading: false,
  error: null,
  selectedPatient: null,

  setQuery: async (query) => {
    set({ query, loading: true, error: null });

    try {
      const res = await api.get(`${API_URL}/patients/search`, {
        params: { q: query },
      });
      set({ results: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearSearch: () => set({ query: '', results: [] }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearSelectedPatient: () => set({ selectedPatient: null }),
}));

export default useSearchStore;
