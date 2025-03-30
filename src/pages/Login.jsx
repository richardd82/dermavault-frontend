import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import logoImg from "../assets/derma-logo.png";

const Login = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(credentials.username, credentials.password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };
console.log(theme, "EL THEME")
  return (
    <div className={`bg-[#f8f9fa] dark:bg-[#1a1b1e] transition-colors duration-500 ${theme}`}>
      <div className="w-screen h-screen flex flex-col md:flex-row">
        {/* Branding - Top on mobile / Left on desktop */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center px-10 bg-[#a78bfa] dark:bg-[#4f46e5] text-white dark:text-[#f8f9fa]">
          <div className="w-[284px] h-[284px] flex items-center justify-center">            
            <img src={logoImg} alt="Logo" />
          </div>
          <h1 className="text-4xl font-light mb-4">DermaVault</h1>
          <p className="text-lg text-center max-w-sm">
            Cuidamos tu piel, registramos tu historia.
          </p>
        </div>

        {/* Formulario - Bottom on mobile / Right on desktop */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-[#f8f9fa] dark:bg-[#1a1b1e] relative transition-colors duration-300">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md p-8 bg-white dark:bg-[#2a2b2f] text-gray-800 dark:text-[#e5e7eb] shadow-xl rounded-2xl transition-all duration-300">
            {error && (
              <p className="text-red-500 text-center text-lg font-bold">{error}</p>
            )}
            <h2 className="text-2xl font-semibold mb-6">Iniciar sesión</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                type="text"
                name="username"
                placeholder="Usuario"
                value={credentials.username}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white rounded-lg hover:opacity-80 transition"
              >
                Iniciar sesión
              </button>
              <p className="text-center text-sm mt-4">
                ¿Olvidaste tu contraseña?{" "}
                <a href="#" className="text-[#a78bfa] dark:text-[#4f46e5] hover:underline">
                  Recuperala
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;