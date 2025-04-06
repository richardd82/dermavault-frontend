// components/EditHistoryModal.jsx
import React, { useState } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import toast from "react-hot-toast";

const EditHistoryModal = ({ history, onClose }) => {
  const { updateHistory } = useMedicalHistoryStore();

  const [formData, setFormData] = useState({
    padecimiento_actual: history?.ClinicalData?.padecimiento_actual || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, padecimiento_actual: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateHistory(history.id, {
        clinical_data: {
          padecimiento_actual: formData.padecimiento_actual,
        },
      });
      toast.success("Historia actualizada");
      onClose();
    } catch (err) {
      toast.error("Error al actualizar");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1a1b1e] rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Historia Clínica</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300">Padecimiento actual</label>
            <textarea
              name="padecimiento_actual"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={formData.padecimiento_actual}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHistoryModal;
