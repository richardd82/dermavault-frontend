import { create } from "zustand";
import api from "../hooks/axiosConfig"; // tu instancia Axios con token

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const usePatientPaginationStore = create((set, get) => ({
  patients: [],
  offset: 0,
  limit: 100,
  hasMore: true,
  loading: false,
  total: 0,

  fetchMorePatients: async () => {
    const { offset, limit, hasMore, loading, patients } = get();
    if (!hasMore || loading) return;

    set({ loading: true });

    try {
      const response = await api.get(
        `${API_URL}/patients/patients?limit=${limit}&offset=${offset}`
      );

      const newPatients = response.data.patients || [];

      set({
        patients: [...patients, ...newPatients],
        offset: offset + limit,
        hasMore: response.data.hasMore ?? newPatients.length === limit,
        total: response.data.total ?? get().total,
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error al cargar pacientes:", error);
      set({ loading: false });
    }
  },

  updateOnePatient: (updatedPatient) => {
    set((state) => {
      // Filtra pacientes inválidos y actualiza por cédula
      const cleanPatients = (state.patients || [])
        .filter(p => p && p.cedula !== undefined && p.cedula !== null);
  
      return {
        patients: cleanPatients.map(p => 
          p.cedula === updatedPatient.cedula ? updatedPatient : p
        ),
      };
    });
  },

  resetPagination: () => {
    set({
      patients: [],
      offset: 0,
      hasMore: true,
    });
  },
}));

export default usePatientPaginationStore;

// store/patientPaginationStore.js
// import { create } from "zustand";
// import api from "../hooks/axiosConfig"; // tu instancia con token
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// const usePatientPaginationStore = create((set, get) => ({
//   patients: [],
//   offset: 0,
//   limit: 100,
//   hasMore: true,
//   loading: false,

//   fetchMorePatients: async () => {
//     const { offset, limit, hasMore, loading, patients } = get();
//     if (!hasMore || loading) return;

//     set({ loading: true });

//     try {
//       const res = await api.get(`${API_URL}/patients/patients?limit=${limit}&offset=${offset}`);
//       console.log("Respuesta completa:", res.data);

//       const newPatients = structuredClone(res.data.patients); // fuerza referencia nueva

//       set({
//         patients: [...patients, ...newPatients], // esto forzará re-render
//         offset: offset + limit,
//         hasMore: res.data.hasMore,
//         loading: false,
//       });
//     } catch (error) {
//       console.error("Error al cargar pacientes:", error);
//       set({ loading: false });
//     }
//   },

//   resetPagination: () => {
//     set({
//       patients: [],
//       offset: 0,
//       hasMore: true,
//     });
//   },
// }));

// export default usePatientPaginationStore;

// // stores/patientPaginationStore.js
// import { create } from "zustand";
// import axios from "axios";
// import api from "../hooks/axiosConfig";

// const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.1:3000/api';

// const usePatientPaginationStore = create((set, get) => ({
//   patients: [],
//   offset: 0,
//   limit: 100,
//   hasMore: true,
//   loading: false,

//     // Modal state
//     showModal: false,
//     patient: null,
  
//     openPatientModal: (patient) => set({ showModal: true, patient }),
//     closePatientModal: () => set({ showModal: false, patient: null }),

//   fetchMorePatients: async () => {
//     const { offset, limit, hasMore, patients, loading } = get();
//     if (!hasMore || loading) return;
//     set({ loading: true });
    
//     try {
//       const res = await api.get(`${API_URL}/patients/patients?limit=${limit}&offset=${offset}`);
//       console.log("Respuesta completa:", res.data);
//       set({
//         patients: [...patients, ...res.data.patients],
//         offset: offset + limit,
//         hasMore: res.data.hasMore,
//         loading: false,
//       });
//     } catch (error) {
//       console.error("Error al cargar pacientes:", error);
//       set({ loading: false });
//     }
//   },
// }));

// export default usePatientPaginationStore;