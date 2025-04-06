// patientStore.js
import { create } from 'zustand';
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const usePatientStore = create((set, get) => ({
  patients: [],
  loading: false,
  error: null,
  patient: null,
  showModal: false,

  // Obtener todos los pacientes
  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`${API_URL}/patients/patients`);
      // console.log(res.data, "respuesta de pacientes desde el store");
      set({ patients: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Error al obtener usuarios", loading: false });
    }
  },
  // Crear paciente
  createPatient: async (newData) => {
    try {
      const res = await api.post(`${API_URL}/patients/patient`, newData);
      set((state) => ({ patients: [...state.patients, res.data] }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Error al crear usuario" };
    }
  },
  // Editar paciente
  editPatient: async (id, updatedData) => {
    try {
      const res = await api.put(`${API_URL}/patients/patient/${id}`, updatedData);
      const updatedList = get().patients.map(patient =>
        patient.id === id ? res.data : patient
      );
      set({ patients: updatedList, patient: res.data });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Error al actualizar usuario" };
    }
  },

  // Control modal
  openPatientModal: (patient) => set({ patient, showModal: true }),
  closePatientModal: () => set({ showModal: false, patient: null }),
}));

export default usePatientStore;