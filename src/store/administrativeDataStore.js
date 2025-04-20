// store/administrativeDataStore.js
import { create } from 'zustand';
import api from '../hooks/axiosConfig';

const useAdministrativeDataStore = create((set) => ({
  administrativeData: {},
  loading: false,
  error: null,

  // Obtener datos administrativos por patient_id
  getAdminDataByPatientId: async (patient_id) => {
    try {
      const res = await api.get(`/adminData/${patient_id}`);
      set({ administrativeData: res.data });
      return res.data.data;
    } catch (error) {
      console.error('Error al obtener datos administrativos:', error);
      set({ error });
      return null;
    }
  },

  // Crear o actualizar datos administrativos por patient_id
  saveAdminData: async (patient_id, data) => {
    try {
      const res = await api.post(`/adminData/${patient_id}`, data);
      set((state) => ({
        administrativeData: {
          ...state.administrativeData,
          [patient_id]: res.data,
        },
      }));
      return res.data;
    } catch (error) {
      console.error('Error al guardar datos administrativos:', error);
      set({ error });
      throw error;
    }
  },
}));

export default useAdministrativeDataStore;
