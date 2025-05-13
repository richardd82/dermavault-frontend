import React, { useEffect, useState, useRef, useCallback } from "react";
import useMedicalHistoryPaginationStore from "../store/medicalHistoriesPaginationStore";
import useSearchStore from "../store/searchStore";
import NewHistoryModal from "../components/NewHistoryModal";
import EditHistoryModal from "../components/EditHistoryModal";
import HistoryDetailModal from "../components/HistoryDetailModal";
import useDebounce from "../hooks/useDebounce";

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
  const { histories, fetchMoreHistories, hasMore, loading, total } =
    useMedicalHistoryPaginationStore();
  const {
    historyQuery,
    setHistoryQuery,
    searchHistoriesInDB,
    loadingHistoriesSearch,
    setLoadingHistoriesSearch,
    historyResults,
  } = useSearchStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  // const [externalResults, setExternalResults] = useState([]);
  const debouncedHistoryQuery = useDebounce(historyQuery, 300);

  const observer = useRef();

  const lastCardRef = useCallback(
    (node) => {
      if (loading || !hasMore || historyQuery.trim().length > 0) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchMoreHistories();
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreHistories, historyQuery]
  );

  useEffect(() => {
    fetchMoreHistories();
  }, []);

  useEffect(() => {
    const clean = debouncedHistoryQuery.trim();
    const isNumeric = /^\d+$/.test(clean);

    if ((isNumeric && clean.length < 1) || (!isNumeric && clean.length < 3)) {
      // No necesitas setear externalResults aquí, ya que searchHistoriesInDB lo manejará o reseteará en el store
      setLoadingHistoriesSearch(false); // Asegúrate de quitar el loading
      return;
    }

    setLoadingHistoriesSearch(true);
    // Llama a la función que ahora guarda en el store
    searchHistoriesInDB(clean); // <-- Ya no necesitas .then().setExternalResults
    // La función searchHistoriesInDB ahora maneja el loading y los resultados en el store
  }, [debouncedHistoryQuery, searchHistoriesInDB, setLoadingHistoriesSearch]); // Agrega dependencias si es necesario

  const isSearching = historyQuery.length > 0;
  const displayHistories = isSearching ? historyResults : histories;

  const handleHistorySearchChange = (e) => {
    const value = e.target.value;
    setHistoryQuery(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.code === "Minus") {
      e.preventDefault();
    }
  };
  console.log(selectedHistory, "selectedHistory");
  return (
    <div className='p-4'>
      <div className='sticky top-0 z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700 pb-2 mb-6'>
        <div className='flex flex-col min-[1144px]:flex-row min-[1144px]:justify-between items-center gap-4 px-4'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
            Historias Clínicas
          </h2>
          <button
            onClick={() => setShowNewModal(true)}
            className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition w-full min-[1144px]:w-auto'
          >
            + Nueva Historia
          </button>
          <input
            type='text'
            placeholder='Buscar por nombre, cédula o padecimiento'
            value={historyQuery}
            onChange={handleHistorySearchChange}
            onKeyDown={handleKeyDown}
            className='px-3 py-2 border rounded-md bg-white dark:bg-[#2a2b2f] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 w-full min-[1144px]:w-[300px]'
          />
          <p className='text-sm font-bold text-gray-600 dark:text-gray-300'>
            Mostrando {displayHistories.length}{" "}
            {displayHistories.length === 1 ? "registro" : "registros"}
            <br className='hidden lg:block 2xl:hidden' />
            {isSearching && ` para "${historyQuery}"`} de {total}
          </p>
        </div>
      </div>

      <div className='relative overflow-y-auto max-h-[calc(100vh-305px)] lg:max-h-[calc(100vh-180px)] pr-6 pl-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4'>
        {loadingHistoriesSearch && (
          <div className='absolute inset-0 z-30 bg-black bg-opacity-40 flex justify-center items-center'>
            <div className='w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin'></div>
          </div>
        )}

        {Array.isArray(displayHistories) && displayHistories.length > 0
          ? displayHistories.map((history, index) => {
              const isLast = index === displayHistories.length - 1;
              return (
                <div
                  key={history.id}
                  ref={isLast ? lastCardRef : null}
                  className='bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border md:w-[90%] border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:scale-95 transition'
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
                      e.stopPropagation();
                      setSelectedHistory(history);
                    }}
                    className='mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white text-sm rounded-md hover:opacity-70 transition'
                  >
                    Abrir
                  </button>
                </div>
              );
            })
          : // Si no es un array o está vacío, muestra un mensaje (opcional)
            !loadingHistoriesSearch && (
              <p className='text-center text-gray-500 dark:text-gray-400 mt-8'>
                {isSearching
                  ? "No se encontraron resultados."
                  : "No hay historias clínicas disponibles."}
              </p>
            )}
      </div>

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
