import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-8'>
      <div className='bg-white dark:bg-[#2a2b2f] w-full max-w-md rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto'>
        {/* Título */}
        {title && (
          <h2 className='text-xl font-semibold text-[#1f2937] dark:text-[#e5e7eb] mb-4'>
            {title}
          </h2>
        )}

        {/* Contenido (formulario u otro) */}
        <div>{children}</div>

        {/* Botón cerrar (esquina superior derecha) */}
        <button
          onClick={onClose}
          className='absolute top-3 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-bold'
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
