// stores/patientPaginationStore.js
import { create } from "zustand";
import axios from "axios";
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const usePatientPaginationStore = create((set, get) => ({
  patients: [],
  offset: 0,
  limit: 100,
  hasMore: true,
  loading: false,

  fetchMorePatients: async () => {
    const { offset, limit, hasMore, patients, loading } = get();
    if (!hasMore || loading) return;
    set({ loading: true });
    
    try {
      const res = await api.get(`${API_URL}/patients/patients?limit=${limit}&offset=${offset}`);
      console.log("Respuesta completa:", res.data);
      set({
        patients: [...patients, ...res.data.patients],
        offset: offset + limit,
        hasMore: res.data.hasMore,
        loading: false,
      });
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
      set({ loading: false });
    }
  },
}));

export default usePatientPaginationStore;