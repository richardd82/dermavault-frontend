import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import useSearchStore from "../store/searchStore";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import PatientModal from "../components/PatientModal";
import { FaSearch, FaBars } from "react-icons/fa";
import logoImg from "../assets/derma-logo.png";
import useDebounce from "../hooks/useDebounce";

export default function MainLayout() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [setSearch] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false); // ← NUEVO
  const menuRef = useRef(null);

  const {
    patientQuery,
    setQuery,
    searchPatients,
    clearPatientSearch,
    clearSelectedPatient,
    patientResults,
    selectedPatient,
    setSelectedPatient,
  } = useSearchStore();
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(patientQuery, 300); // 300ms de espera

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpenUserMenu(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const clean = debouncedQuery; // sin trim
    const isNumeric = /^\d+$/.test(clean);

    if (isNumeric) {
      if (clean.length < 1) {
        setShowResults(false);
        return;
      }
    } else {
      if (clean.length < 3) {
        setShowResults(false);
        return;
      }
    }

    searchPatients(clean);
    setShowResults(true);
  }, [debouncedQuery]);
  
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.code === "Minus") {
      e.preventDefault(); // Evita que se escriba
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setQuery(value); // ✅ actualiza estado del query
    if (value === "") {
      clearPatientSearch(); // 🔥 Limpiar resultados y resetear estado
      setShowResults(false);
      return;
    }

    setShowResults(value.length >= 1);
  };

  if (!user) return null;
  return (
    <div
      className={`flex h-screen bg-[#f8f9fa] text-[#1f2937] dark:bg-[#1a1b1e] dark:text-[#e5e7eb] transition-colors duration-500 ${theme}`}
    >
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-[250px] h-full bg-[#f8f9fa] dark:bg-[#2a2b2f] border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex md:flex-col justify-end`}
      >
        <div className='flex items-center h-[72px] md:h-[94px] px-3 text-xl md:text-lg font-bold bg-[#a78bfa] dark:bg-[#4f46e5] text-white w-full'>
          <div className='w-16 h-[37px] scale-150 overflow-hidden mr-2'>
            <img
              src={logoImg}
              alt='Logo MedBox'
              className='object-contain -translate-y-1'
            />
          </div>
          <span className='text-ellipsis whitespace-nowrap overflow-hidden max-w-[160px] md:max-w-[180px] lg:max-w-none'>
            MedBox 2025
          </span>
        </div>

        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      <div className='flex flex-col flex-1'>
        <header className='flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-16 md:py-5 bg-white dark:bg-[#2a2b2f] border-b border-gray-200 dark:border-gray-700'>
          {/* === Izquierda: Botón + Buscador === */}
          <div className='flex-1 flex items-center gap-4'>
            <button
              className='md:hidden text-[#4f46e5] dark:text-[#a78bfa]'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars size={20} />
            </button>

            {/* Buscador centrado */}
            <div
              className='relative w-full max-w-xl block mx-auto px-2 sm:px-0'
              ref={dropdownRef}
            >
              <input
                type='text'
                value={patientQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder='Buscar paciente...'
                className='pl-10 pr-4 py-2 w-full rounded-md bg-[#f8f9fa] dark:bg-[#1f2023] border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
              />
              <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />

              {/* 👇 SOLO mostramos el dropdown si NO estamos en /patients */}
              {location.pathname !== "/patients" &&
                showResults &&
                patientResults.length > 0 && (
                  <div className='absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-auto'>
                    {patientResults.map((p) => (
                      <div
                        key={p.id}
                        className='px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2a2b2f] cursor-pointer'
                        onClick={() => {
                          setSelectedPatient(p);
                          clearPatientSearch();
                          setSearch("");
                          setShowResults(false); // importante para cerrar el dropdown
                        }}
                      >
                        <span className='font-medium'>
                          {p.nombre} {p.apellido}
                        </span>{" "}
                        — <span className='text-gray-500'>{p.cedula}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* === Usuario y Toggle === */}
          <div className='relative flex items-center' ref={menuRef}>
            {/* botón avatar + nombre */}
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className='flex items-center gap-2 focus:outline-none'
              aria-haspopup='true'
              aria-expanded={openUserMenu}
            >
              <div className='w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center'>
                <span className='text-lg font-bold'>
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className='hidden sm:block text-sm font-medium'>
                {user?.username}
              </span>
            </button>

            {/* MENÚ DESPLEGABLE */}
            <div
              className={`absolute right-0 top-12 w-44 origin-top-right rounded-md shadow-lg
                bg-white dark:bg-[#2a2b2f] ring-1 ring-black/5 dark:ring-white/10
                transition transform
                ${
                  openUserMenu
                    ? "scale-100 opacity-100 z-50"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              style={{ transitionDuration: "120ms" }}
            >
              <button
                onClick={() => {
                  setOpenUserMenu(false);
                  navigate("/profile"); // si tienes pantalla de perfil
                }}
                className='block w-full text-left px-4 py-2 text-sm
                 text-[#1f2937] dark:text-gray-200
                 hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5]'
              >
                Perfil
              </button>

              <button
                onClick={() => {
                  useAuthStore.getState().logout(); // cierra sesión
                  navigate("/"); // lleva al login
                }}
                className='block w-full text-left px-4 py-2 text-sm
                 text-[#1f2937] dark:text-gray-200
                 hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5]'
              >
                Cerrar sesión
              </button>
            </div>

            {/* interruptor de tema */}
            <div className='ml-4'>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* === ÁREA DE CONTENIDO === */}
        <main className='pt-0 px-4 md:px-[0px] sm:max-w-screen-xl mx-auto min-h-[calc(100vh-80px)] md:w-3/3 2xl:w-screen '>
          <Outlet />
        </main>
      </div>

      {/* === MODAL DE PACIENTE === */}
      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => clearSelectedPatient()}
        />
      )}
    </div>
  );
}
