// components/HistoryDetailModal.jsx
import React, { useState } from "react";
import clsx from "clsx";
import { useEffect } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";


//Maneja los valores de las historias clínicas en modo View y muestra inputs en modo Edit
const LabelValue = ({ label, value, editMode, name, onChange }) => (
  <div className="grid grid-cols-2 gap-4 items-start py-1 border-b border-gray-200 dark:border-gray-700">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-1">
      {label}
    </label>
    {editMode ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={1}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full resize-none overflow-hidden"
        style={{ minHeight: "2.5rem" }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
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
  const { updateHistory } = useMedicalHistoryStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const { Patient, ClinicalData, Allergy, GeneralMedicalHistory, Diagnosis, EvolutionDates } = formData;

  const handleSave = async () => {
    const { id } = history; // ID de la historia clínica

    const payload = {
      clinical_data: formData.ClinicalData,
      allergies: formData.Allergy,
      general_history: formData.GeneralMedicalHistory,
      diagnosis: formData.Diagnosis,
      evolutions: formData.EvolutionDates
    };

    try {
      await updateHistory(id, payload); // tu función del store
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1b1e] w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Detalles de la Historia Clínica
          </h2>
          <div className="space-x-2">
            <button
              onClick={editMode ? handleSave : () => setEditMode(true)}
              className={clsx(
                "px-4 py-2 rounded-md text-white",
                "bg-[#a78bfa] dark:bg-[#4f46e5]"
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
              EvolutionDates.map((evo) => (
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

// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci dolore voluptas corrupti et ea ratione dicta pariatur! Consequatur in quo veniam placeat cumque culpa dignissimos neque, necessitatibus quas sunt, molestiae velit omnis impedit voluptatum corrupti ipsam quis possimus, doloremque ut. Natus facere quasi odio hic voluptate quam incidunt ducimus commodi, quidem itaque aut explicabo nulla similique temporibus iure magni voluptatibus! Vero, hic illo impedit blanditiis enim voluptates ut! Ut quia facere, eum numquam cum cumque officiis vel hic repellat consectetur praesentium reprehenderit id, mollitia neque voluptate harum fugit aperiam modi molestias eveniet dolore expedita. Accusantium, totam? Quam voluptatum eum saepe.
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe rerum laboriosam commodi harum vitae voluptatum magnam incidunt sint adipisci eveniet debitis, eum ex fugiat nemo labore, voluptate, delectus eos soluta recusandae natus consequuntur? Laboriosam numquam quam quo dolores obcaecati tempora illum laborum. Ut ex explicabo cumque voluptas velit recusandae quibusdam?
// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint, reprehenderit? Incidunt, aspernatur totam inventore laborum consequuntur nostrum nobis, dolorum assumenda aliquam ullam eum voluptatem velit?
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, aliquam?