import { create } from "zustand";
import api from "../hooks/axiosConfig"; // tu configuración de axios

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const useBackupStore = create((set) => ({
  loading: false,
  success: null,
  error: null,

  generateBackup: async () => {
    set({ loading: true, error: null });
  
    try {
      const res = await api.post(`${API_URL}/backup/generate`);
      const fileName = res.data.fileName;
  
      const blobRes = await api.get(`/backup/download/${fileName}`, {
        responseType: "blob",
      });
  
      const blob = new Blob([blobRes.data], { type: "application/sql" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
  
      set({ loading: false, success: res.data.message });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error al generar respaldo",
      });
    }
  },

  restoreBackup: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    set({ loading: true, error: null });

    try {
      const res = await api.post(`${API_URL}/backup/restore`, formData);
      set({ loading: false, success: res.data.message });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error al restaurar respaldo",
      });
    }
  },

  resetStatus: () => set({ success: null, error: null }),
}));

export default useBackupStore;
