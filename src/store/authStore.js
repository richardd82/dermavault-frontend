import { create } from 'zustand';
import axios from 'axios';

// Definir la URL base del backend en Railway o local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // 🔹 Modificamos login para guardar el `id`
  login: async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });

      const { id, token, username: userName, email, role, first_name, last_name, last_login, is_active } = res.data;

      const userData = { id, username: userName, email, role, first_name, last_name, last_login, is_active };

      // Guardamos en LocalStorage y Zustand
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      set({ user: userData, token, isAuthenticated: true });

      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
