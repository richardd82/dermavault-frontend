import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Definir la URL base del backend en Railway o local
const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.1:3000/api";

const useAuthStore = create((set) => {
  const token = localStorage.getItem("token");
  let user = null;
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp > now) {
        // Token aún válido
        user = JSON.parse(localStorage.getItem("user"));
        isAuthenticated = true;
      } else {
        // Token expirado
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.warn("Token inválido:", err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return {
    user,
    token,
    isAuthenticated,

    login: async (username, password) => {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, {
          username,
          password,
        });

        const {
          id,
          token,
          username: userName,
          email,
          role,
          first_name,
          last_name,
          last_login,
          is_active,
        } = res.data;

        const userData = {
          id,
          username: userName,
          email,
          role,
          first_name,
          last_name,
          last_login,
          is_active,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        set({ user: userData, token, isAuthenticated: true });

        return { success: true };
      } catch (error) {
        console.error("Error en login:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Error al iniciar sesión",
        };
      }
    },

    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  };
});

export default useAuthStore;
