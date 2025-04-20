import React, { useRef } from "react";
import useBackupStore from "../store/backupStore";
import toast from "react-hot-toast";

const BackupModal = () => {
  const fileInputRef = useRef();
  const {
    generateBackup,
    restoreBackup,
    loading,
    success,
    error,
    resetStatus,
  } = useBackupStore();

  const handleGenerate = async () => {
    await generateBackup();
    if (success) toast.success(success);
    if (error) toast.error(error);
    resetStatus();
  };

  const handleRestore = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return toast.error("Selecciona un archivo .sql");
    await restoreBackup(file);
    if (success) toast.success(success);
    if (error) toast.error(error);
    resetStatus();
  };

  const Overlay = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin'></div>
    </div>
  );

  if (loading ) return <Overlay />;

  return (
    
    <div className='space-y-4'>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className='bg-green-600 text-white px-4 py-2 rounded'
      >
        Generar respaldo
      </button>

      <div className='flex flex-col gap-2'>
        <input
          ref={fileInputRef}
          type='file'
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.size > 0) {
              console.log("Archivo listo para subir:", file.name);
              restoreBackup(file); // tu función de upload
            } else {
              alert("Archivo no válido o vacío");
            }
          }}
          accept='.sql'
        />
        <button
          onClick={handleRestore}
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Restaurar desde archivo
        </button>
      </div>
    </div>
  );
};

export default BackupModal;
