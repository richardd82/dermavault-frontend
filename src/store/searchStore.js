import { create } from "zustand";
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const useSearchStore = create((set, get) => ({
  // Pacientes
  patientQuery: "",
  patientResults: [],
  loadingPatients: false,
  errorPatients: null,

  // Historias clínicas
  historyQuery: "",
  historyResults: [],
  loadingHistories: false,
  errorHistories: null,
  historyCedulas: [],
  loadingHistoriesSearch: false,

  // Paciente seleccionado (para modal, por ejemplo)
  selectedPatient: null,

  // ======== Funciones de búsqueda ========
  // ✅ Solo actualiza la query (texto que se escribe)
  setQuery: (patientQuery) => set({ patientQuery }),

  searchPatients: async (query) => {
    set({
      patientQuery: query,
      loadingPatients: true,
      errorPatients: null,
      patientResults: [],
    });
    // console.log(get().patientResults, 'patientResults');
    const clean = query?.trim() || "";
    const isNumeric = /^\d+$/.test(clean);

    // Condiciones mínimas para lanzar búsqueda
    if ((isNumeric && clean.length < 1) || (!isNumeric && clean.length < 3)) {
      return set({ patientResults: [], loadingPatients: false });
    }

    // Inicia búsqueda

    try {
      const res = await api.get(`${API_URL}/patients/search`, {
        params: { q: clean },
      });

      // console.log(res.data, "✅ Resultados de pacientes");
      set({ patientResults: res.data, loadingPatients: false });
    } catch (err) {
      console.error("❌ Error buscando pacientes:", err);
      set({
        errorPatients: err.message,
        loadingPatients: false,
        patientResults: [],
      });
    }
  },

  searchHistories: async (query) => {
    set({ historyQuery: query, loadingHistories: true, errorHistories: null });
    if (!query || query.length < 2)
      return set({ historyResults: [], loadingHistories: false });

    try {
      const res = await api.get(`${API_URL}/histories/search`, {
        params: { q: query },
      });
      set({ historyResults: res.data.data, loadingHistories: false });
    } catch (error) {
      set({ errorHistories: error.message, loadingHistories: false });
    }
  },

  searchHistoriesInDB: async (query) => {
    set({ loadingHistoriesSearch: true, historyResults: [] }); // Limpiar resultados anteriores al buscar
    const clean = query.trim();
    const isNumeric = /^\d+$/.test(clean);
  
    if ((isNumeric && clean.length < 1) || (!isNumeric && clean.length < 3)) {
      set({ loadingHistoriesSearch: false });
      return []; // Retornar array vacío si la query es muy corta
    }
  
    try {
      const res = await api.get(`${API_URL}/histories/search-exact`, { params: { q: clean } });
      set({ historyResults: res.data.data || [], loadingHistoriesSearch: false }); // <-- Guardar resultados aquí
      return res.data.data || [];
    } catch (error) {
      console.error("Error buscando en la base de datos:", error);
      set({ loadingHistoriesSearch: false, historyResults: [] }); // Limpiar resultados y quitar loading en caso de error
      throw error; // Propagar el error si es necesario
    }
  },
  
  // Mantén esta función que agregamos antes
  // updateOneSearchResult: (updatedHistory) => {
  //   set((state) => ({
  //     historyResults: state.historyResults.map((h) =>
  //       h.id === updatedHistory.id ? updatedHistory : h
  //     ),
  //   }));
  // },
  updateOneSearchResult: (updatedHistory) => {
    set((state) => {
      // ** Verificación clave: Asegura que historyResults sea un array antes de mapear **
      if (!Array.isArray(state.historyResults)) {
        console.error("useSearchStore: state.historyResults no es un array al intentar actualizar un resultado:", state.historyResults);
        // En este caso, no podemos usar .map. Simplemente retornamos el estado actual
        // sin hacer la actualización en searchResults para evitar el error.
        // El usuario verá el dato actualizado al hacer una nueva búsqueda.
        return state;
      }

      // Si es un array, procedemos a mapear y actualizar la historia específica
      const updatedResults = state.historyResults.map((h) =>
        h.id === updatedHistory.id ? updatedHistory : h
      );

      return {
        historyResults: updatedResults,
      };
    });
  },
  
  getAllHistoryCedulas: async () => {
    const { historyCedulas } = get(); // Obtener el estado actual de historyCedulas
    if (historyCedulas?.length > 0) return historyCedulas;

    try {
      const res = await api.get(`${API_URL}/histories/cedulas`);
      const data = res.data?.data || [];

      set({ historyResults: res.data, loadingHistoriesSearch: false });
      return data;
    } catch (err) {
      console.error("Error al obtener cédulas de historias clínicas:", err);
      set({ loadingHistoriesSearch: false });
      return [];
    }
  },

  updateOneSearchResult: (updatedHistory) => {
    set((state) => ({
      historyResults: state.historyResults.map((h) =>
        h.id === updatedHistory.id ? updatedHistory : h
      ),
    }));
  },

  setHistoryQuery: (query) => set({ historyQuery: query }),
  setHistoriesInDB: (query) => set({ historyResults: query }),
  // ======== Limpiar búsqueda ========

  clearPatientSearch: () =>
    set({
      patientQuery: "",
      patientResults: [],
      loadingPatients: false,
      errorPatients: null,
    }),

  clearHistorySearch: () =>
    set({
      historyQuery: "",
      historyResults: [],
      loadingHistories: false,
      errorHistories: null,
    }),

  clearHistoryCedulas: () => set({ historyCedulas: [] }),

  // ======== Paciente seleccionado (por buscador global) ========

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearSelectedPatient: () => set({ selectedPatient: null }),
  setLoadingHistoriesSearch: (loading) =>
    set({ loadingHistoriesSearch: loading }),
}));

export default useSearchStore;