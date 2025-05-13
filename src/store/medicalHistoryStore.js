// store/medicalHistoryStore.js
import { create } from "zustand";
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.1:3000/api";

const useMedicalHistoryStore = create((set, get) => ({
  histories: [],
  loading: false,
  error: null,

  getHistories: async () => {
    try {
      set({ loading: true });
      const res = await api.get(`${API_URL}/histories?limit=1000&offset=0`);
      console.log("Historias recibidas:", res.data.data);
      set({ histories: res.data?.data, loading: false });
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
    try {
      // Agrega try...catch para mejor manejo de errores en el store también
      const res = await api.put(`${API_URL}/histories/${id}`, data ); // Corregido aquí
      const updatedHistory = res.data.updatedHistory;

      set((state) => ({
        histories: state.histories.map((h) =>
          h.id === updatedHistory.id ? updatedHistory : h
        ),
      }));

      return updatedHistory; // Asegúrate de retornar la historia actualizada
    } catch (error) {
      console.error("Error updating history in store:", error);
      throw error; // Re-lanza el error para que el modal lo capture
    }
  },

  // updateHistory: async (id, data) => {
  //   const res = await api.put(`${API_URL}/histories/:id`, data);
  //   const updatedHistory = res.data.updatedHistory;

  //   set((state) => ({
  //     histories: state.histories.map((h) =>
  //       h.id === id ? updatedHistory : h
  //     ),
  //   }));

  //   return updatedHistory;
  // },

  // updateHistory: async (id, data) => {
  //   const res = await api.put(`${API_URL}/histories/${id}`, data);
  //   const updatedHistory = res.data.updatedHistory;

  //   set((state) => ({
  //     histories: state.histories.map((h) =>
  //       h.id === id ? updatedHistory : h
  //     ),
  //   }));

  // return updatedHistory;
  // },

  // updateHistory: async (id, data) => {
  //   const res = await api.put(`${API_URL}/histories/${id}`, data);
  //   set((state) => ({
  //     histories: state.histories.map((h) => (h.id === id ? updated : h)),
  //   }));
  //   return res.data.updatedHistory;
  // },

  deleteHistory: async (id) => {
    await api.delete(`${API_URL}/histories/${id}`);
    set((state) => ({
      histories: state.histories.filter((h) => h.id !== id),
    }));
  },

  getHistoryByCedula: async (cedula) => {
    try {
      const res = await api.get(`/histories/cedula/${cedula}`);
      return res.data;
    } catch (err) {
      return err; // No hay historia
    }
  },

  selectedHistory: null,
  setSelectedHistory: (history) => set({ selectedHistory: history }),
  clearSelectedHistory: () => set({ selectedHistory: null }),
}));

export default useMedicalHistoryStore;
