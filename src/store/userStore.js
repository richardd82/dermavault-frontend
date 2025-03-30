import { create } from "zustand";
import axios from "axios";
import api from "../hooks/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  // Obtener todos los usuarios
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`${API_URL}/users`);
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Error al obtener usuarios", loading: false });
    }
  },

  //Crear usuario
  addUser: async (newUser) => {
    try {
      const res = await api.post(`${API_URL}/users`, newUser);
      console.log(res, "respuesta del servidor");
      set((state) => ({ users: [...state.users, res.data] }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Error al crear usuario" };
    }
  },

  // Modificar usuario
  updateUser: async (id, updatedData) => {
    try {
      const res = await api.put(`${API_URL}/users/${id}`, updatedData);

      // Actualizar el usuario modificado en la lista
      const updatedUsers = get().users.map(user =>
        user.id === id ? res.data : user
      );
      set({ users: updatedUsers });

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Error al actualizar usuario" };
    }
  },

  // Eliminar (inactivar) usuario
  deleteUser: async (id) => {
    try {
      const res = await api.delete(`${API_URL}/users${id}`);

      // Eliminar usuario localmente (o marcar como inactivo si tu API lo hace)
      const updatedUsers = get().users.filter(user => user.id !== id);
      set({ users: updatedUsers });

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Error al eliminar usuario" };
    }
  }
}));

export default useUserStore;
