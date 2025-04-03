import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import useSearchStore from "../store/searchStore";
import { useDebounce } from "../hooks/useDebounce";

import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import PatientModal from "../components/PatientModal";
import { FaSearch, FaBars } from "react-icons/fa";
import logoImg from "../assets/derma-logo.png";

export default function MainLayout() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const {
    results,
    setQuery,
    clearSearch,
    selectedPatient,
    setSelectedPatient,
    clearSelectedPatient
  } = useSearchStore();

  useEffect(() => {
    if (debounced.trim().length > 1) {
      setQuery(debounced);
    } else {
      clearSearch();
    }
  }, [debounced]);

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
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:flex-col justify-end`}
      >
        <div className='flex items-center gap-4 h-[72px] md:h-[80px] p-4 text-xl font-bold bg-[#a78bfa] dark:bg-[#4f46e5] text-white'>
          <img src={logoImg} alt='Logo DermaVault' className='w-12 h-12' />
          DermaVault
        </div>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      <div className='flex flex-col flex-1'>
        <header className='flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-[#2a2b2f] border-b border-gray-200 dark:border-gray-700'>
          {/* === Izquierda: Botón + Buscador === */}
          <div className='flex-1 flex items-center gap-4'>
            <button
              className='md:hidden text-[#4f46e5] dark:text-[#a78bfa]'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars size={20} />
            </button>

            {/* Buscador centrado */}
            <div className='relative w-full max-w-xl hidden sm:block mx-auto'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Buscar paciente...'
                className='pl-10 pr-4 py-2 w-full rounded-md bg-[#f8f9fa] dark:bg-[#1f2023] border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
              />
              <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />

              {results.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                  {results.map((p) => (
                    <div
                      key={p.id}
                      className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2a2b2f] cursor-pointer"
                      onClick={() => {
                        setSelectedPatient(p);
                        clearSearch();
                        setSearch('');
                      }}
                    >
                      <span className="font-medium">{p.nombre} {p.apellido}</span> — <span className="text-gray-500">{p.cedula}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === Usuario y Toggle === */}
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

// import { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import useAuthStore from "../store/authStore";
// import useThemeStore from "../store/themeStore";
// import useSearchStore from "../store/searchStore";
// import { useDebounce } from "../hooks/useDebounce";

// import Sidebar from "../components/Sidebar";
// import ThemeToggle from "../components/ThemeToggle";
// import PatientModal from "../components/PatientModal";
// import { FaSearch, FaBars } from "react-icons/fa";
// import logoImg from "../assets/derma-logo.png";

// export default function MainLayout() {
//   const { user } = useAuthStore();
//   const { theme } = useThemeStore();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [search, setSearch] = useState("");
//   const debounced = useDebounce(search, 300);
//   const {
//     results,
//     setQuery,
//     clearSearch,
//     selectedPatient,
//     setSelectedPatient,
//     clearSelectedPatient
//   } = useSearchStore();

//   useEffect(() => {
//     if (debounced.trim().length > 1) {
//       setQuery(debounced);
//     } else {
//       clearSearch();
//     }
//   }, [debounced]);

//   return (
//     <div
//       className={`flex h-screen bg-[#f8f9fa] text-[#1f2937] dark:bg-[#1a1b1e] dark:text-[#e5e7eb] transition-colors duration-500 ${theme}`}
//     >
//       {sidebarOpen && (
//         <div
//           className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden'
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 z-40 w-[250px] h-full bg-[#f8f9fa] dark:bg-[#2a2b2f] border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:flex-col justify-end`}
//       >
//         <div className='flex items-center gap-4 h-[72px] md:h-[80px] p-4 text-xl font-bold bg-[#a78bfa] dark:bg-[#4f46e5] text-white'>
//           <img src={logoImg} alt='Logo DermaVault' className='w-12 h-12' />
//           DermaVault
//         </div>
//         <Sidebar closeSidebar={() => setSidebarOpen(false)} />
//       </aside>

//       <div className='flex flex-col flex-1'>
//         <header className='flex flex-wrap gap-4 items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-[#2a2b2f] border-b border-gray-200 dark:border-gray-700'>
//           <div className='flex items-center gap-4'>
//             <button
//               className='md:hidden text-[#4f46e5] dark:text-[#a78bfa]'
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <FaBars size={20} />
//             </button>

//             <div className='relative hidden sm:block w-full max-w-xl'>
//               <input
//                 type='text'
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder='Buscar paciente...'
//                 className='pl-10 pr-4 py-2 bg-[#f8f9fa] dark:bg-[#1f2023] border border-gray-300 dark:border-gray-600 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
//               />
//               <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />

//               {results.length > 0 && (
//                 <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
//                   {results.map((p) => (
//                     <div
//                       key={p.id}
//                       className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2a2b2f] cursor-pointer"
//                       onClick={() => {
//                         setSelectedPatient(p);
//                         clearSearch();
//                         setSearch('');
//                       }}
//                     >
//                       <span className="font-medium">{p.nombre} {p.apellido}</span> — <span className="text-gray-500">{p.cedula}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className='flex items-center gap-4'>
//             <div className='w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center'>
//               <span className='text-xl font-bold'>
//                 {user?.username[0].toUpperCase()}
//               </span>
//             </div>
//             <span className='text-sm md:text-base font-medium'>
//               {user?.username}
//             </span>
//             <ThemeToggle />
//           </div>
//         </header>

//         <main className='flex-1 overflow-y-auto p-4 md:p-6'>
//           <Outlet />
//         </main>
//       </div>

//       {selectedPatient && (
//         <PatientModal
//           patient={selectedPatient}
//           onClose={() => clearSelectedPatient()}
//         />
//       )}
//     </div>
//   );
// }


// // import { useState } from "react";
// // import { Outlet } from "react-router-dom";
// // import useAuthStore from "../store/authStore";
// // import useThemeStore from "../store/themeStore";
// // import Sidebar from "../components/Sidebar";
// // import ThemeToggle from "../components/ThemeToggle";
// // import { FaSearch, FaBars } from "react-icons/fa";
// // import logoImg from "../assets/derma-logo.png";

// // export default function MainLayout() {
// //   const { user } = useAuthStore();
// //   const { theme } = useThemeStore();
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   return (
// //     <div
// //       className={`flex h-screen bg-[#f8f9fa] text-[#1f2937] dark:bg-[#1a1b1e] dark:text-[#e5e7eb] transition-colors duration-500 ${theme}`}
// //     >
// //       {/* === BACKDROP PARA MOBILE === */}
// //       {sidebarOpen && (
// //         <div
// //           className='fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden'
// //           onClick={() => setSidebarOpen(false)}
// //         />
// //       )}

// //       {/* === SIDEBAR === */}
// //       <aside
// //         className={`fixed top-0 left-0 z-40 w-[250px] h-full bg-[#f8f9fa] dark:bg-[#2a2b2f] border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
// //         ${
// //           sidebarOpen ? "translate-x-0" : "-translate-x-full"
// //         } md:translate-x-0 md:static md:flex md:flex-col justify-end`}
// //       >
// //         <div className='flex items-center gap-4 h-[72px] md:h-[80px] p-4 text-xl font-bold bg-[#a78bfa] dark:bg-[#4f46e5] text-white'>
// //           <img src={logoImg} alt='Logo DermaVault' className='w-12 h-12' />
// //           DermaVault
// //         </div>
// //         <Sidebar closeSidebar={() => setSidebarOpen(false)}/>
// //       </aside>

// //       {/* === CONTENIDO PRINCIPAL === */}
// //       <div className='flex flex-col flex-1'>
// //         {/* === HEADER SUPERIOR === */}
// //         <header className='flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-[#2a2b2f] border-b border-gray-200 dark:border-gray-700'>
// //           <div className='flex items-center gap-4'>
// //             {/* Botón hamburguesa */}
// //             <button
// //               className='md:hidden text-[#4f46e5] dark:text-[#a78bfa]'
// //               onClick={() => setSidebarOpen(!sidebarOpen)}
// //             >
// //               <FaBars size={20} />
// //             </button>

// //             {/* Input búsqueda */}
// //             <div className='relative hidden sm:block'>
// //               <input
// //                 type='text'
// //                 placeholder='Buscar paciente...'
// //                 className='pl-10 pr-4 py-2 rounded-md bg-[#f8f9fa] dark:bg-[#1f2023] border border-gray-300 dark:border-gray-600 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
// //               />
// //               <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />
// //             </div>
// //           </div>

// //           {/* Usuario + toggle */}
// //           <div className='flex items-center gap-4'>
// //             <div className='w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center'>
// //               <span className='text-xl font-bold'>
// //                 {user?.username[0].toUpperCase()}
// //               </span>
// //             </div>
// //             <span className='text-sm md:text-base font-medium'>
// //               {user?.username}
// //             </span>
// //             <ThemeToggle />
// //           </div>
// //         </header>

// //         {/* === ÁREA DE CONTENIDO === */}
// //         <main className='flex-1 overflow-y-auto p-4 md:p-6'>
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }
