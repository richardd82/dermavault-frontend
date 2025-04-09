import React, { useEffect, useState } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import useSearchStore from "../store/searchStore";
import NewHistoryModal from "../components/NewHistoryModal";
import EditHistoryModal from "../components/EditHistoryModal";
import HistoryDetailModal from "../components/HistoryDetailModal";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const MedicalHistories = () => {
  const { histories, getHistories, loading } =
    useMedicalHistoryStore();
  // console.log(histories, "historias desde Fichas Médicas");
  const {
    historyQuery,
    setHistoryQuery,
    searchHistories,
  } = useSearchStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    getHistories();
  }, [getHistories]);

  const isSearching = historyQuery.trim().length >= 2;

  const filteredHistories = histories.filter((history) => {
    const search = historyQuery?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fullName = `${history?.Patient?.nombre || ""} ${history?.Patient?.apellido || ""}`
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cedula = history.Patient?.cedula?.toLowerCase() || "";
    const padecimiento = history.ClinicalData?.padecimiento_actual?.toLowerCase() || "";

    return fullName.includes(search) || cedula.includes(search) || padecimiento.includes(search);
  });

  return (
    <div className='p-4'>
      <div className='sticky top-[0px] md:top-[0px] z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700 pb-2 flex flex-col sm:flex-row justify-center items-start sm:items-center mb-6'>
        <div className='flex flex-row w-full sm:w-auto items-center gap-36'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
            Historias Clínicas
          </h2>


          <input
            type='text'
            placeholder='Buscar por nombre, cédula o padecimiento'
            value={historyQuery}
            onChange={(e) => {
              const val = e.target.value;
              setHistoryQuery(val);
              searchHistories(val);
            }}
            className='w-full sm:w-96 px-3 py-2 border rounded-md bg-white dark:bg-[#2a2b2f] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
          />
          <p className="text-1xl font-bold text-gray-600 dark:text-gray-300 mt-2">
            Mostrando {filteredHistories.length} {filteredHistories.length === 1 ? 'registro' : 'registros'}{isSearching && ` para "${historyQuery}"`}
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition'
          >
            + Nueva Historia
          </button>
        </div>

      </div>

      {loading && (
        <p className='text-gray-500 dark:text-gray-400'>Cargando...</p>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredHistories.map((history) => (
          <div
            key={history.id}
            className='bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:scale-95 transition'
          >
            <div className='w-16 h-16 rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] flex items-center justify-center text-white text-xl font-semibold mb-3'>
              {getInitials(
                `${history?.Patient?.nombre} ${history?.Patient?.apellido}`
              )}
            </div>

            <h3 className='text-md font-semibold text-gray-800 dark:text-gray-100'>
              {history?.Patient?.nombre} {history?.Patient?.apellido}
            </h3>

            <p className='text-sm text-gray-500 dark:text-gray-300'>
              Cédula: {history?.Patient?.cedula}
            </p>

            <p className='text-xs mt-2 text-gray-400 dark:text-gray-400'>
              Última cita: {formatDate(history.updatedAt)}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation(); // <- clave
                setSelectedHistory(history);
              }}
              className='mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white text-sm rounded-md hover:opacity-70 transition'
            >
              Abrir
            </button>
          </div>
        ))}
      </div>

      {!loading && filteredHistories.length === 0 && (
        <p className='text-gray-500 dark:text-gray-400 mt-4'>
          No hay historias registradas.
        </p>
      )}

      {showNewModal && (
        <NewHistoryModal onClose={() => setShowNewModal(false)} />
      )}
      {editingHistory && (
        <EditHistoryModal
          history={editingHistory}
          onClose={() => setEditingHistory(null)}
        />
      )}
      {selectedHistory && (
        <HistoryDetailModal
          history={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
    </div>
  );
};

export default MedicalHistories;

// // components/MedicalHistories.jsx
// import React, { useEffect, useState } from "react";
// import useMedicalHistoryStore from "../store/medicalHistoryStore";
// import useSearchStore from "../store/searchStore";
// import NewHistoryModal from "../components/NewHistoryModal";
// import EditHistoryModal from "../components/EditHistoryModal";
// import HistoryDetailModal from "../components/HistoryDetailModal";
// import { FaSearch } from "react-icons/fa";
// import { useDebounce } from "../hooks/useDebounce";

// const getInitials = (name) => {
//   if (!name) return "";
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// };

// const formatDate = (date) => {
//   const d = new Date(date);
//   return d.toLocaleDateString("es-MX", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// const MedicalHistories = () => {
//   const { histories, getHistories, loading } = useMedicalHistoryStore();
//   const { searchHistories, query, setQuery, results } = useSearchStore();
//   const [showNewModal, setShowNewModal] = useState(false);
//   const [editingHistory, setEditingHistory] = useState(null); // para Editar
//   const [selectedHistory, setSelectedHistory] = useState(null);
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 300);
//   const filteredHistories = histories.filter((h) => {
//   const fullName = `${h?.Patient?.nombre} ${h?.Patient?.apellido}`.toLowerCase();
//   const cedula = h?.Patient?.cedula?.toLowerCase();
//   const padecimiento = h?.ClinicalData?.padecimiento_actual?.toLowerCase();
//   const search = query.toLowerCase();

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     searchHistories(value); // 👈 aquí usamos directamente la función del store
//   };

//   useEffect(() => {
//     getHistories();
//     if (debouncedSearch.trim().length > 1) {
//       searchHistories(debouncedSearch);
//     } else {
//       getHistories(); // si se borra la búsqueda, recarga todas
//     }
//   }, [debouncedSearch]);

//   return (
//     <div className='p-4'>
//       <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4'>
//         <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
//           Historias Clínicas
//         </h2>
//         <div className='flex flex-col gap-1 w-full sm:w-1/3'>
//           <label className='text-sm text-gray-700 dark:text-gray-300 font-medium'>
//             Buscar historia clínica
//           </label>
//           <div className='relative'>
//             <input
//               type='text'
//               value={query}
//               onChange={handleSearchChange}
//               placeholder='Buscar por nombre, apellido, cédula o padecimiento...'
//               className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1b1e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]'
//             />
//             <FaSearch className='absolute top-2.5 left-3 text-gray-500 dark:text-gray-400' />
//           </div>
//         </div>

//         <button
//           onClick={() => setShowNewModal(true)}
//           className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition w-full sm:w-auto'
//         >
//           + Nueva Historia
//         </button>
//       </div>

//       {loading && (
//         <p className='text-gray-500 dark:text-gray-400'>Cargando...</p>
//       )}

//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
//       {filteredHistories.map((history) => (
//           <div
//             key={history.id}
//             // onClick={() => setSelectedHistory(history)}
//             className='bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:transition-transform hover:scale-95 transition'
//           >
//             <div className='w-16 h-16 rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] flex items-center justify-center text-white text-xl font-semibold mb-3'>
//               {getInitials(
//                 `${history?.Patient?.nombre} ${history?.Patient?.apellido}`
//               )}
//             </div>

//             <h3 className='text-md font-semibold text-gray-800 dark:text-gray-100'>
//               {history?.Patient?.nombre} {history?.Patient?.apellido}
//             </h3>

//             <p className='text-sm text-gray-500 dark:text-gray-300'>
//               Cédula: {history?.Patient?.cedula}
//             </p>

//             <p className='text-xs mt-2 text-gray-400 dark:text-gray-400'>
//               Última cita: {formatDate(history.updatedAt)}
//             </p>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // <- clave
//                 setSelectedHistory(history);
//               }}
//               className='mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white text-sm rounded-md hover:opacity-70 transition'
//             >
//               Abrir
//             </button>
//           </div>
//         ))}
//       </div>

//       {!loading && histories.length === 0 && (
//         <p className='text-gray-500 dark:text-gray-400 mt-4'>
//           No hay historias registradas.
//         </p>
//       )}

//       {showNewModal && (
//         <NewHistoryModal onClose={() => setShowNewModal(false)} />
//       )}
//       {editingHistory && (
//         <EditHistoryModal
//           history={editingHistory}
//           onClose={() => setEditingHistory(null)}
//         />
//       )}
//       {selectedHistory && (
//         <HistoryDetailModal
//           history={selectedHistory}
//           onClose={() => setSelectedHistory(null)}
//           onEdit={(h) => {
//             setEditingHistory(h);
//             setSelectedHistory(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default MedicalHistories;
