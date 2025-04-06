// components/MedicalHistories.jsx
import React, { useEffect, useState } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
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
  const { histories, getHistories, loading } = useMedicalHistoryStore();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null); // para Editar
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    getHistories();
  }, []);

  return (
    <div className='p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
          Historias Clínicas
        </h2>

        <button
          onClick={() => setShowNewModal(true)}
          className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition'
        >
          + Nueva Historia
        </button>
      </div>

      {loading && (
        <p className='text-gray-500 dark:text-gray-400'>Cargando...</p>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {histories.map((history) => (
          <div
            key={history.id}
            // onClick={() => setSelectedHistory(history)}
            className='bg-white dark:bg-[#2a2b2f] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center text-center hover:shadow-lg hover:transition-transform hover:scale-95 transition'
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
                setSelectedHistory(history)
              }}
              className='mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white text-sm rounded-md hover:opacity-70 transition'
            >
              Abrir
            </button>
          </div>
        ))}
      </div>

      {!loading && histories.length === 0 && (
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
          onEdit={(h) => {
            setEditingHistory(h);
            setSelectedHistory(null);
          }}
        />
      )}
    </div>
  );
};

export default MedicalHistories;
