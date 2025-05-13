import { create } from "zustand";

// Verificar si hay un tema guardado en localStorage, si no, usar "dark"
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  return storedTheme || "dark"; // 👈 Por defecto, será 'dark'
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    return { theme: newTheme };
  }),
}));

// Aplicar el tema al cargar la página
document.documentElement.setAttribute("data-theme", getInitialTheme());

export default useThemeStore;

