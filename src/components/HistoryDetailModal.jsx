// components/HistoryDetailModal.jsx
import React, { useState } from "react";
import clsx from "clsx";

//Maneja los valores de las historias clínicas en modo View y muestra inputs en modo Edit
const LabelValue = ({ label, value, editMode, name, onChange }) => (
  <div className="grid grid-cols-2 gap-4 items-center py-1 border-b border-gray-200 dark:border-gray-700">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {editMode ? (
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="text-sm border bg-slate-100 border-gray-600 dark:border-gray-600 rounded-md px-2 py-1 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
      />
    ) : (
      <span className="text-sm text-gray-900 dark:text-gray-100">
        {value ?? "Vacío"}
      </span>
    )}
  </div>
);

const HistoryDetailModal = ({ history, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...history });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { Patient, ClinicalData, Allergy, GeneralMedicalHistory, Diagnosis, EvolutionDates } = formData;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1b1e] w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Detalles de la Historia Clínica
          </h2>
          <div className="space-x-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={clsx(
                "px-4 py-2 rounded-md text-white",
                editMode ? "bg-[#4f46e5]" : "bg-[#a78bfa]"
              )}
            >
              {editMode ? "Guardar" : "Editar"}
            </button>
            <button
              onClick={onClose}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paciente */}
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Paciente
            </h3>
            <LabelValue
              label="Nombre"
              value={`${Patient?.nombre} ${Patient?.apellido}`}
              editMode={false}
            />
            <LabelValue label="Cédula" value={Patient?.cedula} editMode={false} />
            <LabelValue label="Correo" value={Patient?.email} editMode={false} />
            <LabelValue
              label="Teléfono móvil"
              value={Patient?.telefono_movil}
              editMode={false}
            />
          </section>

          {/* Datos Clínicos */}
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Datos Clínicos
            </h3>
            {Object.entries(ClinicalData || {}).filter(([key]) => !["id", "medical_history_id", "createdAt", "updatedAt"].includes(key)).map(([key, val]) => (
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
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Alergias
            </h3>
            {Object.entries(Allergy || {}).filter(([key]) => !["id", "medical_history_id", "createdAt", "updatedAt"].includes(key)).map(([key, val]) => (
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
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Historia Médica General
            </h3>
            {Object.entries(GeneralMedicalHistory || {}).filter(([key]) => !["id", "medical_history_id", "createdAt", "updatedAt"].includes(key)).map(([key, val]) => (
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
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Diagnóstico
            </h3>
            {Object.entries(Diagnosis || {}).filter(([key]) => !["id", "medical_history_id", "createdAt", "updatedAt"].includes(key)).map(([key, val]) => (
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
          <section className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
              Fechas de Evolución
            </h3>
            {Array.isArray(EvolutionDates) && EvolutionDates.length > 0 ? (
              EvolutionDates.map((evo, i) => (
                <LabelValue
                  key={evo.id}
                  label={new Date(evo.date).toLocaleDateString("es-MX")}
                  value={evo.observation}
                  editMode={false}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
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

// import React from "react";
// import LabelValue from "../components/LabelValue"; // Asegúrate de tener este componente creado
// import clsx from "clsx";

// const HistoryDetailModal = ({ history, onClose }) => {
//   const {
//     Patient,
//     ClinicalData,
//     Allergy,
//     GeneralMedicalHistory,
//     Diagnosis,
//     EvolutionDates,
//   } = history;

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
//       <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-4xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detalle de Historia Clínica</h2>
//           <button
//             onClick={onClose}
//             className={clsx(
//               'bg-[#a78bfa] dark:bg-[#4f46e5]',
//               'text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition'
//             )}
//           >
//             Cerrar
//           </button>
//         </div>

//         {/* Sección: Paciente */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Paciente</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <LabelValue label="Nombre" value={`${Patient?.nombre} ${Patient?.apellido}`} />
//             <LabelValue label="Cédula" value={Patient?.cedula} />
//             <LabelValue label="Correo" value={Patient?.email} />
//             <LabelValue label="Teléfono móvil" value={Patient?.telefono_movil} />
//           </div>
//         </div>

//         {/* Sección: Datos Clínicos */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Datos Clínicos</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <LabelValue label="Padecimiento actual" value={ClinicalData?.padecimiento_actual} />
//             <LabelValue label="Antecedentes heredofamiliares" value={ClinicalData?.antecedentes_heredofamiliares} />
//             <LabelValue label="Antecedentes personales" value={ClinicalData?.antecedentes_personales} />
//             <LabelValue label="Resto de aparatos y sistemas" value={ClinicalData?.resto_aparatos_sistemas} />
//             <LabelValue label="Tendencia a queloides" value={ClinicalData?.cicatrices_queloides} />
//             <LabelValue label="Tensión arterial" value={ClinicalData?.tension_arterial} />
//             <LabelValue label="Sangrado o hematomas" value={ClinicalData?.sangrado_hematomas} />
//             <LabelValue label="Ciclo menstrual" value={ClinicalData?.ciclo_menstrual} />
//             <LabelValue label="Tabaquismo" value={ClinicalData?.tabaquismo} />
//             <LabelValue label="Alcoholismo" value={ClinicalData?.alcoholismo} />
//             <LabelValue label="Problemas emocionales" value={ClinicalData?.problemas_emocionales} />
//           </div>
//         </div>

//         {/* Sección: Alergias */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Alergias</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <LabelValue label="Analgésicos" value={Allergy?.analgesicos} />
//             <LabelValue label="Anestésicos" value={Allergy?.anestesicos} />
//             <LabelValue label="Yodo" value={Allergy?.yodo} />
//             <LabelValue label="Adhesivos" value={Allergy?.adhesivos} />
//             <LabelValue label="Material de sutura" value={Allergy?.material_sutura} />
//             <LabelValue label="Otros" value={Allergy?.otros} />
//           </div>
//         </div>

//         {/* Sección: Historia Médica General */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Historia Médica General</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <LabelValue label="Topografía" value={GeneralMedicalHistory?.topografia} />
//             <LabelValue label="Morfología" value={GeneralMedicalHistory?.morfologia} />
//             <LabelValue label="Resto de piel y anexos" value={GeneralMedicalHistory?.resto_piel_anexos} />
//           </div>
//         </div>

//         {/* Sección: Diagnóstico */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Diagnóstico</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <LabelValue label="Diagnóstico principal" value={Diagnosis?.diagnostico_principal} />
//             <LabelValue label="Otros diagnósticos" value={Diagnosis?.otros_diagnosticos} />
//           </div>
//         </div>

//         {/* Sección: Fechas de Evolución */}
//         <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Fechas de Evolución</h3>
//           {EvolutionDates?.length > 0 ? (
//             <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
//               {EvolutionDates.map((evo) => (
//                 <li key={evo.id}>
//                   <span className="font-semibold">
//                     {new Date(evo.date).toLocaleDateString("es-MX")}:
//                   </span>{" "}
//                   {evo.observation || "Vacío"}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-500">No hay registros.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HistoryDetailModal;
