import React, { useEffect, useState, useRef, useCallback } from "react";
import useMedicalHistoryPaginationStore from "../store/medicalHistoriesPaginationStore"; // nuevo store
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
  const {
    histories,
    fetchMoreHistories,
    hasMore,
    loading,
  } = useMedicalHistoryPaginationStore();

  const { historyQuery, setHistoryQuery, searchHistories } = useSearchStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const observer = useRef();

  const lastCardRef = useCallback(
    (node) => {
      if (loading || !hasMore || historyQuery.trim().length > 0) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreHistories();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreHistories, historyQuery]
  );

  useEffect(() => {
    fetchMoreHistories(); // primera carga
    // console.log("Historias clínicas cargadas:", histories)
  }, []);

  const isSearching = historyQuery.trim().length >= 2;

  const filteredHistories = histories.filter((history) => {
    const search = historyQuery
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const fullName = `${history?.Patient?.nombre || ""} ${history?.Patient?.apellido || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const cedula = history?.Patient?.cedula?.toLowerCase() || "";
    const padecimiento = history?.ClinicalData?.padecimiento_actual?.toLowerCase() || "";

    return fullName.includes(search) || cedula.includes(search) || padecimiento.includes(search);
  });

  return (
    <div className="p-4">
      <div className="sticky top-0 md:top-[0px] z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
        <div className="flex flex-col min-[1144px]:flex-row min-[1144px]:justify-between min-[1144px]:items-center gap-4 px-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Historias Clínicas</h2>

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition w-full min-[1144px]:w-auto"
          >
            + Nueva Historia
          </button>

          <input
            type="text"
            placeholder="Buscar por nombre, cédula o padecimiento"
            value={historyQuery}
            onChange={(e) => {
              const val = e.target.value;
              setHistoryQuery(val);
              searchHistories(val);
            }}
            className="px-3 py-2 border rounded-md bg-white dark:bg-[#2a2b2f] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 w-full min-[1144px]:w-[300px]"
          />

          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
            Mostrando {filteredHistories.length}{" "}
            {filteredHistories.length === 1 ? "registro" : "registros"}
            {isSearching && ` para "${historyQuery}"`}
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      )}

      <div className="overflow-y-auto max-h-[calc(100vh-305px)] lg:max-h-[calc(100vh-180px)] pr-6 pl-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
        {filteredHistories.map((history, index) => {
          const isLast = index === filteredHistories.length - 1;
          return (
            <div
              key={history.id}
              ref={isLast ? lastCardRef : null}
              className="bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border md:w-[90%] border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:scale-95 transition"
            >
              <div className="w-16 h-16 rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] flex items-center justify-center text-white text-xl font-semibold mb-3">
                {getInitials(`${history?.Patient?.nombre} ${history?.Patient?.apellido}`)}
              </div>

              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                {history?.Patient?.nombre} {history?.Patient?.apellido}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-300">
                Cédula: {history?.Patient?.cedula}
              </p>

              <p className="text-xs mt-2 text-gray-400 dark:text-gray-400">
                Última cita: {formatDate(history.updatedAt)}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHistory(history);
                }}
                className="mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white text-sm rounded-md hover:opacity-70 transition"
              >
                Abrir
              </button>
            </div>
          );
        })}
      </div>

      {!loading && filteredHistories.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          No hay historias registradas.
        </p>
      )}

      {showNewModal && <NewHistoryModal onClose={() => setShowNewModal(false)} />}
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

// import React, { useEffect, useState } from "react";
// import useMedicalHistoryStore from "../store/medicalHistoryStore";
// import useSearchStore from "../store/searchStore";
// import NewHistoryModal from "../components/NewHistoryModal";
// import EditHistoryModal from "../components/EditHistoryModal";
// import HistoryDetailModal from "../components/HistoryDetailModal";

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
//   // console.log(histories, "historias desde Fichas Médicas");
//   const { historyQuery, setHistoryQuery, searchHistories } = useSearchStore();

//   const [showNewModal, setShowNewModal] = useState(false);
//   const [editingHistory, setEditingHistory] = useState(null);
//   const [selectedHistory, setSelectedHistory] = useState(null);

//   useEffect(() => {
//     getHistories().then(() => {
//       console.log("Historias clínicas cargadas:", histories);
//       });
//   }, [getHistories]);

//   const isSearching = historyQuery.trim().length >= 2;

//   const filteredHistories = histories.filter((history) => {
//     const search = historyQuery
//       ?.toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "");
//     const fullName = `${history?.Patient?.nombre || ""} ${history?.Patient?.apellido || ""
//       }`
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "");
//     const cedula = history.Patient?.cedula?.toLowerCase() || "";
//     const padecimiento =
//       history.ClinicalData?.padecimiento_actual?.toLowerCase() || "";

//     return (
//       fullName.includes(search) ||
//       cedula.includes(search) ||
//       padecimiento.includes(search)
//     );
//   });

//   return (
//     <div className='p-4'>
//       <div className="sticky top-0 md:top-[0px] z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
//         <div className="flex flex-col min-[1144px]:flex-row min-[1144px]:justify-between min-[1144px]:items-center gap-4 px-4">

//           {/* Título */}
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             Historias Clínicas
//           </h2>

//           {/* Botón */}
//           <button
//             onClick={() => setShowNewModal(true)}
//             className="bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition w-full min-[1144px]:w-auto"
//           >
//             + Nueva Historia
//           </button>

//           {/* Input de búsqueda */}
//           <input
//             type="text"
//             placeholder="Buscar por nombre, cédula o padecimiento"
//             value={historyQuery}
//             onChange={(e) => {
//               const val = e.target.value;
//               setHistoryQuery(val);
//               searchHistories(val);
//             }}
//             className="px-3 py-2 border rounded-md bg-white dark:bg-[#2a2b2f] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 w-full min-[1144px]:w-[300px]"
//           />

//           {/* Leyenda */}
//           <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
//             Mostrando {filteredHistories.length}{" "}
//             {filteredHistories.length === 1 ? "registro" : "registros"}
//             {isSearching && ` para "${historyQuery}"`}
//           </p>
//         </div>
//       </div>


//       {loading && (
//         <p className='text-gray-500 dark:text-gray-400'>Cargando...</p>
//       )}

//       <div className='overflow-y-auto max-h-[calc(100vh-305px)] lg:max-h-[calc(100vh-180px)] pr-6 pl-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4'>
//         {filteredHistories.map((history) => (
//           <div
//             key={history.id}
//             className='bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border md:w-[90%] border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:scale-95 transition'
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
        
//       {!loading && filteredHistories.length === 0 && (
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
//         />
//       )}
//     </div>
//   );
// };

// export default MedicalHistories;
