// patientStore.js
import { create } from 'zustand';
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const usePatientStore = create((set) => ({
  patients: [],
  loading: false,
  error: null,

  // Acción asíncrona para obtener la lista de pacientes
  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`${API_URL}/patients/patients`);
      console.log(res.data, "respuesta de pacientes desde el store");
      set({ patients: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Error al obtener usuarios", loading: false });
    }
  },
}));

export default usePatientStore;
