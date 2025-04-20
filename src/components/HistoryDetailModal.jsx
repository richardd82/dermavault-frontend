// components/HistoryDetailModal.jsx
import React, { useState } from "react";
import clsx from "clsx";
import { useEffect } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import useMedicalHistoryPaginationStore from "../store/medicalHistoriesPaginationStore";
import CloseModalButton from "./CloseModalButton";

//Maneja los valores de las historias clínicas en modo View y muestra inputs en modo Edit
const LabelValue = ({ label, value, editMode, name, onChange }) => (
  <div className='grid grid-cols-2 gap-4 items-start py-1 border-b border-gray-200 dark:border-gray-700'>
    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 pt-1'>
      {label}
    </label>
    {editMode ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={1}
        className='text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full resize-none overflow-hidden'
        style={{ minHeight: "2.5rem" }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
    ) : (
      <span className='text-sm text-gray-900 dark:text-gray-100'>
        {value ?? "Vacío"}
      </span>
    )}
  </div>
);

const HistoryDetailModal = ({ history, onClose }) => {
  // console.log("👉 Datos de la historia:", history);
  // console.log("👉 Fechas de evolución:", history.EvolutionDates);

  const [editMode, setEditMode] = useState(false);
  const { updateHistory } = useMedicalHistoryStore();
  const [formData, setFormData] = useState(() => ({
    ...history,
    EvolutionDates: history.EvolutionDates || [],
  }));
  const { updateOneHistory } = useMedicalHistoryPaginationStore();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const {
    Patient,
    ClinicalData,
    Allergy,
    GeneralMedicalHistory,
    Diagnosis,
    EvolutionDates,
  } = formData;
  useEffect(() => {
    if (editMode) {
      // Ajustar todos los textareas al contenido existente
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((ta) => {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      });
    }
  }, [editMode]);

  const handleSave = async () => {
    const { id } = history;
    // console.log("🧾 FormData antes de enviar:", formData); 
    const cleanEvolutionDates = Array.isArray(formData.EvolutionDates)
  ? formData.EvolutionDates.map(({ id, date, observation }) => ({
      ...(id && { id }),
      date,
      observation
    }))
  : [];
    
    const payload = {
      clinical_data: formData.ClinicalData,
      allergies: formData.Allergy,
      general_history: formData.GeneralMedicalHistory,
      diagnosis: formData.Diagnosis,
      EvolutionDates: cleanEvolutionDates,
    };
    
    console.log("✅ Payload enviado:", payload);
    try {
      const updated = await updateHistory(id, payload);

      // 👇 Este paso evita que el modal se quede con datos viejos o en blanco
      setFormData(updated); //✅
      updateOneHistory(updated);
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const handleAddEvolution = () => {
    setFormData((prev) => ({
      ...prev,
      EvolutionDates: [
        { date: "", observation: "" },
        ...(prev.EvolutionDates || []),
      ],
    }));
  };
  const datesSorted = [...(formData.EvolutionDates || [])]
  .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("es-MX", { timeZone: "UTC" });
  

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
        <CloseModalButton onClick={onClose} className="fixed top-4 right-4 z-50"/>      
      <div className='bg-white dark:bg-[#1a1b1e] w-full max-w-4xl rounded-lg shadow-lg flex flex-col overflow-y-hidden max-h-[90vh] pr-6 pl-6 pb-14 space-y-6'>
        <div className='sticky top-0 z-20 mt-4'>
          <div className=' flex justify-between items-center border-b pb-5 bg-white dark:bg-[#1a1b1e] '>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              Detalles de la Historia Clínica
            </h2>
            <div className='space-x-2 z-0'>
              <button
                onClick={editMode ? handleSave : () => setEditMode(true)}
                className={clsx(
                  "px-4 py-2 rounded-md text-white",
                  "bg-[#a78bfa] dark:bg-[#4f46e5]"
                )}
              >
                {editMode ? "Guardar" : "Editar"}
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6  overflow-y-auto pr-6 -mr-6'>
          {/* Paciente */}
          <section className='col-span-1 md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
              Paciente
            </h3>
            <LabelValue
              label='Nombre'
              value={`${Patient?.nombre} ${Patient?.apellido}`}
              editMode={false}
            />
            <LabelValue
              label='Cédula'
              value={Patient?.cedula}
              editMode={false}
            />
            <LabelValue
              label='Correo'
              value={Patient?.email}
              editMode={false}
            />
            <LabelValue
              label='Teléfono móvil'
              value={Patient?.telefono_movil}
              editMode={false}
            />
          </section>

          {/* Datos Clínicos */}
          <section className='col-span-1 md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
              Datos Clínicos
            </h3>
            {Object.entries(ClinicalData || {})
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "medical_history_id",
                    "createdAt",
                    "updatedAt",
                  ].includes(key)
              )
              .map(([key, val]) => (
                <LabelValue
                  key={key}
                  label={key.replaceAll("_", " ")}
                  name={key}
                  value={val}
                  editMode={editMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ClinicalData: {
                        ...prev.ClinicalData,
                        [key]: e.target.value,
                      },
                    }))
                  }
                />
              ))}
          </section>

          {/* Alergias */}
          <section className='col-span-1 md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
              Alergias
            </h3>
            {Object.entries(Allergy || {})
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "medical_history_id",
                    "createdAt",
                    "updatedAt",
                  ].includes(key)
              )
              .map(([key, val]) => (
                <LabelValue
                  key={key}
                  label={key.replaceAll("_", " ")}
                  name={key}
                  value={val}
                  editMode={editMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Allergy: {
                        ...prev.Allergy,
                        [key]: e.target.value,
                      },
                    }))
                  }
                />
              ))}
          </section>

          {/* Historia Médica General */}
          <section className='col-span-1 md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
              Historia Médica General
            </h3>
            {Object.entries(GeneralMedicalHistory || {})
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "medical_history_id",
                    "createdAt",
                    "updatedAt",
                  ].includes(key)
              )
              .map(([key, val]) => (
                <LabelValue
                  key={key}
                  label={key.replaceAll("_", " ")}
                  name={key}
                  value={val}
                  editMode={editMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      GeneralMedicalHistory: {
                        ...prev.GeneralMedicalHistory,
                        [key]: e.target.value,
                      },
                    }))
                  }
                />
              ))}
          </section>

          {/* Diagnóstico */}
          <section className='col-span-1 md:col-span-2'>
            <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
              Diagnóstico
            </h3>
            {Object.entries(Diagnosis || {})
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "medical_history_id",
                    "createdAt",
                    "updatedAt",
                  ].includes(key)
              )
              .map(([key, val]) => (
                <LabelValue
                  key={key}
                  label={key.replaceAll("_", " ")}
                  name={key}
                  value={val}
                  editMode={editMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Diagnosis: {
                        ...prev.Diagnosis,
                        [key]: e.target.value,
                      },
                    }))
                  }
                />
              ))}
          </section>
          {/* Fechas de evolución */}
          <section className='col-span-1 md:col-span-2'>
            <div className='sticky top-0 z-20 mt-4 bg-white dark:bg-[#1a1b1e] border-b pb-5'>
              <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
                Fechas de Evolución
              </h3>
              {editMode && (
                <button
                  type='button'
                  onClick={handleAddEvolution}
                  className='mt-2 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white rounded-md text-sm hover:opacity-90 transition'
                >
                  + Agregar Fecha de Evolución
                </button>
              )}
            </div>

            {Array.isArray(formData?.EvolutionDates) &&
            formData.EvolutionDates.length > 0 ? (
              datesSorted.map((evo, index) => (
                <div
                  key={index}
                  className='flex flex-col md:flex-row md:items-start md:gap-8 gap-4 border-b border-gray-200 dark:border-gray-700 py-2'
                >
                  {/* Fecha */}
                  <div className='flex flex-col md:min-w-[200px]'>
                    <label className='text-sm text-gray-700 dark:text-gray-300 mb-1'>
                      Fecha:
                    </label>
                    {editMode ? (
                      <input
                        type='date'
                        value={evo.date}
                        onChange={(e) => {
                          const updated = [...formData.EvolutionDates];
                          updated[index].date = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            EvolutionDates: updated,
                          }));
                        }}
                        className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      />
                    ) : (
                      <span className='text-sm text-gray-900 dark:text-gray-100'>
                        {formatDate(evo.date)}
                      </span>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className='flex-1 flex flex-col'>
                    <label className='text-sm text-gray-700 dark:text-gray-300 mb-1'>
                      Observaciones:
                    </label>
                    {editMode ? (
                      <textarea
                        rows={2}
                        value={evo.observation}
                        onChange={(e) => {
                          const updated = [...formData.EvolutionDates];
                          updated[index].observation = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            EvolutionDates: updated,
                          }));
                        }}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none'
                      />
                    ) : (
                      <div className='bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md text-sm text-gray-900 dark:text-white'>
                        {evo.observation || "Sin observaciones"}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
                No hay registros.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailModal;

// {/* Fechas de evolución */}
// <section className='grid grid-cols-4 gap-4 items-center border-b border-gray-200 dark:border-gray-700 py-2'>
// <div className="sticky top-0 z-20 mt-4 bg-white dark:bg-[#1a1b1e] border-b pb-5">
//   <h3 className='font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2'>
//     Fechas de Evolución
//   </h3>
//   {editMode && (
//     <button
//       type='button'
//       onClick={handleAddEvolution}
//       className='mt-4 px-4 py-2 bg-[#a78bfa] dark:bg-[#4f46e5] text-white rounded-md text-sm hover:opacity-90 transition'
//     >
//       + Agregar Fecha de Evolución
//     </button>
//   )}
// </div>
// {Array.isArray(formData?.EvolutionDates) &&
// formData.EvolutionDates.length > 0 ? (
//   formData.EvolutionDates.map((evo, index) => (
//     <div key={index}>
//       <LabelValue
//         label='Fecha'
//         name={`date-${index}`}
//         value={evo.date}
//         editMode={editMode}
//         onChange={(e) => {
//           const updated = [...formData.EvolutionDates];
//           updated[index].date = e.target.value;
//           setFormData((prev) => ({
//             ...prev,
//             EvolutionDates: updated,
//           }));
//         }}
//       />
//       <LabelValue
//         label='Observación'
//         name={`observation-${index}`}
//         value={evo.observation}
//         editMode={editMode}
//         onChange={(e) => {
//           const updated = [...formData.EvolutionDates];
//           updated[index].observation = e.target.value;
//           setFormData((prev) => ({
//             ...prev,
//             EvolutionDates: updated,
//           }));
//         }}
//       />
//     </div>
//   ))
// ) : (
//   <p className='text-sm text-gray-500 dark:text-gray-400'>
//     No hay registros.
//   </p>
// )}
// </section>
