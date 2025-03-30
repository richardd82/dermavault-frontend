import { useState } from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { FaSearch, FaBars } from "react-icons/fa";
import logoImg from "../assets/derma-logo.png";

export default function MainLayout() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`flex h-screen bg-[#f8f9fa] text-[#1f2937] dark:bg-[#1a1b1e] dark:text-[#e5e7eb] transition-colors duration-500 ${theme}`}
    >
      {/* === BACKDROP PARA MOBILE === */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === SIDEBAR === */}
      <aside
        className={`fixed top-0 left-0 z-40 w-[250px] h-full bg-[#f8f9fa] dark:bg-[#2a2b2f] border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex md:flex-col justify-end`}
      >
        <div className='flex items-center gap-4 h-[72px] md:h-[80px] p-4 text-xl font-bold bg-[#a78bfa] dark:bg-[#4f46e5] text-white'>
          <img src={logoImg} alt='Logo DermaVault' className='w-12 h-12' />
          DermaVault
        </div>
        <Sidebar closeSidebar={() => setSidebarOpen(false)}/>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className='flex flex-col flex-1'>
        {/* === HEADER SUPERIOR === */}
        <header className='flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-[#2a2b2f] border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-4'>
            {/* Botón hamburguesa */}
            <button
              className='md:hidden text-[#4f46e5] dark:text-[#a78bfa]'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars size={20} />
            </button>

            {/* Input búsqueda */}
            <div className='relative hidden sm:block'>
              <input
                type='text'
                placeholder='Buscar paciente...'
                className='pl-10 pr-4 py-2 rounded-md bg-[#f8f9fa] dark:bg-[#1f2023] border border-gray-300 dark:border-gray-600 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
              />
              <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />
            </div>
          </div>

          {/* Usuario + toggle */}
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center'>
              <span className='text-xl font-bold'>
                {user?.username[0].toUpperCase()}
              </span>
            </div>
            <span className='text-sm md:text-base font-medium'>
              {user?.username}
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* === ÁREA DE CONTENIDO === */}
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
