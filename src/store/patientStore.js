// patientStore.js
import { create } from 'zustand';
import api from "../hooks/axiosConfig";
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.1:3000/api';

const usePatientStore = create((set, get) => ({
  patients: [],
  patientsCount: 0,  
  loading: false,
  error: null,
  patient: null,
  showModal: false,

  /* ---------- obtener SOLO el total ---------- */
  fetchPatientsCount: async () => {
    try {
      const res = await api.get(`${API_URL}/patients/count`);
      set({ patientsCount: res.data.count });   // asumiendo { count: 12345 }
    } catch (err) {
      set({ error: "Error al obtener el total de pacientes" });
    }
  },

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
    // console.log(newData, "<====== NewData");
  
    try {
      const res = await api.post(`${API_URL}/patients/patient`, newData);
      set((state) => ({ patients: [...state.patients, res.data] }));
      return { success: true };
    } catch (err) {
      // console.log(err, "<=========================err");
  
      // Verifica si el error tiene un mensaje específico (como la cédula duplicada)
      if (err.response && err.response.data && err.response.data.message) {
        // Muestra el mensaje del backend en el Toast
        toast.error(err.response.data.message, {
          duration: 5000,
          style: {
            background: "#4f46e5", 
            color: "#fff", 
            fontSize: "14px", 
            padding: "16px 20px", 
            borderRadius: "8px", 
          },
        });
        return { success: false, message: err.response.data.message };
      } else {
        // En caso de error desconocido, muestra un mensaje genérico
        toast.error("Error desconocido al crear el paciente.", {
          duration: 5000,
          style: {
            background: "#4f46e5", 
            color: "#fff", 
            fontSize: "14px", 
            padding: "16px 20px", 
            borderRadius: "8px", 
          },
        });
        return { success: false, message: 'Error desconocido al crear el paciente.' };
      }
    }
  },
  
  // createPatient: async (newData) => {
  //   console.log(newData, "<====== NewData")
  //   try {
  //     const res = await api.post(`${API_URL}/patients/patient`, newData);
  //     set((state) => ({ patients: [...state.patients, res.data] }));
  //     return { success: true };
  //   } catch (err) {
  //     console.log(res, "<=========================err")
  //     if (err.response && err.response.data && err.response.data.message) {
  //       return { success: false, message: err.response.data.message };
  //     } else {
  //       return { success: false, message: 'Error desconocido al crear el paciente.' };
  //     }
  //   }
  // },
  // Editar paciente
  editPatient: async (id, updatedData) => {
    try {
      const res = await api.put(`${API_URL}/patients/patient/${id}`, updatedData);
      
      // Asegurar que la respuesta incluya la cédula
      const updatedPatient = { 
        ...res.data,
        cedula: res.data.cedula || updatedData.cedula // Fallback por si la API no la retorna
      };
  
      const updatedList = get().patients.map(patient =>
        patient.cedula === updatedPatient.cedula ? updatedPatient : patient
      );
      
      set({ patients: updatedList, patient: updatedPatient });
      return { success: true, data: updatedPatient };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  // editPatient: async (id, updatedData) => {
  //   try {
  //     const res = await api.put(`${API_URL}/patients/patient/${id}`, updatedData);
  //     const updatedList = get().patients.map(patient =>
  //       patient.id === id ? res.data : patient
  //     );
  //     set({ patients: updatedList, patient: res.data });
  //     return { success: true };
  //   } catch (err) {
  //     return { success: false, message: err.message || "Error al actualizar usuario" };
  //   }
  // },

  // Control modal
  openPatientModal: (patient) => set({ patient, showModal: true }),
  closePatientModal: () => set({ showModal: false, patient: null }),
}));

export default usePatientStore;