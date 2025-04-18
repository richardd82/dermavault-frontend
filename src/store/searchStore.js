import { create } from 'zustand';
import api from '../hooks/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useSearchStore = create((set, get) => ({
  // Pacientes
  patientQuery: '',
  patientResults: [],
  loadingPatients: false,
  errorPatients: null,

  // Historias clínicas
  historyQuery: '',
  historyResults: [],
  loadingHistories: false,
  errorHistories: null,
  historyCedulas: [],

  // Paciente seleccionado (para modal, por ejemplo)
  selectedPatient: null,

  // ======== Funciones de búsqueda ========
  // ✅ Solo actualiza la query (texto que se escribe)
  setQuery: (patientQuery) => set({ patientQuery }),
  
  searchPatients: async (query) => {
    set({ patientQuery: query, loadingPatients: true, errorPatients: null });
    if (!query || query.length < 2) return set({ patientResults: [], loadingPatients: false });

    try {
      const res = await api.get(`${API_URL}/patients/search`, { params: { q: query } });
      // console.log(res.data, 'res patients');
      set({ patientResults: res.data, loadingPatients: false });
    } catch (err) {
      set({ errorPatients: err.message, loadingPatients: false });
    }
  },

  searchHistories: async (query) => {
    set({ historyQuery: query, loadingHistories: true, errorHistories: null });
    if (!query || query.length < 2) return set({ historyResults: [], loadingHistories: false });

    try {
      const res = await api.get(`${API_URL}/histories/search`, { params: { q: query } });
      set({ historyResults: res.data.data, loadingHistories: false });
    } catch (error) {
      set({ errorHistories: error.message, loadingHistories: false });
    }
  },

  searchHistoriesInDB: async (query) => {
    try {
      const res = await api.get(`${API_URL}/histories/search?q=${query}`);
      return res.data.data || [];
    } catch (error) {
      console.error("Error buscando en la base de datos:", error);
      return [];
    }
  },
  
  getAllHistoryCedulas: async () => {
    const { historyCedulas } = get(); // Obtener el estado actual de historyCedulas
    if (historyCedulas?.length > 0) return historyCedulas;
  
    try {
      const res = await api.get(`${API_URL}/histories/cedulas`);
      const data = res.data?.data || [];
  
      set({ historyCedulas: data });
      return data;
    } catch (err) {
      console.error("Error al obtener cédulas de historias clínicas:", err);
      return [];
    }
  },

  setHistoryQuery: (query) => set({ historyQuery: query }),

  // ======== Limpiar búsqueda ========

  clearPatientSearch: () =>
    set({ patientQuery: '', patientResults: [], loadingPatients: false, errorPatients: null }),

  clearHistorySearch: () =>
    set({ historyQuery: '', historyResults: [], loadingHistories: false, errorHistories: null }),

  clearHistoryCedulas: () => set({ historyCedulas: [] }),

  // ======== Paciente seleccionado (por buscador global) ========

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearSelectedPatient: () => set({ selectedPatient: null }),
}));

export default useSearchStore;

// // store/searchStore.js
// import { create } from 'zustand';
// import api from '../hooks/axiosConfig';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// const useSearchStore = create((set) => ({
//   query: '',
//   results: [],
//   loading: false,
//   error: null,
//   selectedPatient: null,

//   setQuery: async (query) => {
//     set({ query, loading: true, error: null });

//     try {
//       const res = await api.get(`${API_URL}/patients/search`, {
//         params: { q: query },
//       });
//       set({ results: res.data, loading: false });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   searchHistories: async (query) => {
//     if (!query || query.length < 2) return;
//     try {
//       const res = await api.get(`${API_URL}/histories/search`, {
//         params: { q: query }, // ✅ Aquí pasamos el parámetro de búsqueda
//       });
//       set({ results: res.data.data }); // o `histories`, según cómo lo manejes
//     } catch (error) {
//       console.error("Error buscando historias:", error);
//     }
//   },
//   filteredHistories: state.histories.filter((history) => {
//     const fullName = `${history?.Patient?.nombre || ''} ${history?.Patient?.apellido || ''}`.toLowerCase();
//     const cedula = history?.Patient?.cedula?.toLowerCase();
//     const padecimiento = history?.ClinicalData?.padecimiento_actual?.toLowerCase();
//     return (
//       fullName.includes(lowerQuery) ||
//       cedula?.includes(lowerQuery) ||
//       padecimiento?.includes(lowerQuery)
//     );
//   }),  

//   clearSearch: () => set({ query: '', results: [] }),
//   setSelectedPatient: (patient) => set({ selectedPatient: patient }),
//   clearSelectedPatient: () => set({ selectedPatient: null }),
// }));

// export default useSearchStore;
