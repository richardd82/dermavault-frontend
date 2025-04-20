import React, { useState } from "react";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import toast from "react-hot-toast";
import CloseModalButton from "./CloseModalButton";

const formatDateForBackend = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NewHistoryModal = ({ onClose, prefillCedula = "" }) => {
  const { createHistory } = useMedicalHistoryStore();
  const today = formatDateForBackend(new Date());
  console.log(today, "today");
  const [formData, setFormData] = useState({
    cedula: prefillCedula ? prefillCedula : "M-",
    clinical_data: {
      padecimiento_actual: "",
      antecedentes_heredofamiliares: "",
      antecedentes_personales: "",
      resto_aparatos_sistemas: "",
      cicatrices_queloides: "",
      tension_arterial: "",
      sangrado_hematomas: "",
      ciclo_menstrual: "",
      tabaquismo: "",
      alcoholismo: "",
      problemas_emocionales: "",
    },
    allergies: {
      analgesicos: "",
      anestesicos: "",
      yodo: "",
      adhesivos: "",
      material_sutura: "",
      otros: "",
    },
    general_history: {
      topografia: "",
      morfologia: "",
      resto_piel_anexos: "",
    },
    diagnosis: {
      diagnostico_principal: "",
      otros_diagnosticos: "",
    },
    EvolutionDates: [
      {
        date: "",
        observation: "",
      },
    ],
  });

  const handleChange = (section, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filtrar evolutions válidos
      console.log("formData.EvolutionDates", formData.EvolutionDates);

      const payload = {
        ...formData,
        EvolutionDates: formData.EvolutionDates,
      };

      await createHistory(payload);
      toast.success("La Historia Clínica se guardó correctamente", {
        duration: 5000,
        style: {
          background: "#4f46e5", // color de fondo
          color: "#fff", // color del texto
          fontSize: "14px", // tamaño de fuente
          padding: "16px 20px", // espaciado interno
          borderRadius: "8px", // bordes redondeados
        },
      });
      onClose();
    } catch (err) {
      toast.error(
        "Error al guardar: " +
          (err.response?.data?.message || err.message || "Error desconocido"),
        {
          duration: 5000,
          style: {
            background: "#4f46e5",
            color: "#fff",
            fontSize: "14px",
            padding: "16px 20px",
            borderRadius: "8px",
          },
        }
      );
    }
  };
  const renderFields = (section, sectionLabel, fields) => (
    <div className='border-t border-gray-300 dark:border-gray-600 pt-4'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        {sectionLabel}
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {fields.map(
          ({
            label,
            name,
            type = "text",
            disabled = false,
            required = false,
          }) => {
            const isDateField = type === "date";
            const value = formData[section][name];

            return (
              <div key={name} className='flex flex-col'>
                <label className='text-sm text-gray-700 dark:text-gray-300'>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={isDateField && !value ? undefined : value}
                  defaultValue={
                    isDateField && !value
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  onChange={(e) => handleChange(section, name, e.target.value)}
                  max={
                    isDateField
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  disabled={disabled}
                  required={required}
                  className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );

  const renderEvolutionDates = () => (
    <section className='col-span-1 md:col-span-2'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        Fechas de Evolución
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {formData.EvolutionDates.map((evo, index) => (
          <React.Fragment key={index}>
            <div className='flex flex-col'>
              <label className='text-sm text-gray-700 dark:text-gray-300'>
                Fecha
              </label>
              <input
                type='date'
                name={`date-${index}`}
                value={evo.date}
                onChange={(e) => {
                  const newData = [...formData.EvolutionDates];
                  newData[index].date = e.target.value;
                  setFormData({ ...formData, EvolutionDates: newData });
                }}
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-gray-700 dark:text-gray-300'>
                Observaciones
              </label>
              <textarea
                value={evo.observation}
                onChange={(e) => {
                  const newData = [...formData.EvolutionDates];
                  newData[index].observation = e.target.value;
                  setFormData({ ...formData, EvolutionDates: newData });
                }}
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );

  // const renderFields = (section, sectionLabel, fields) => (
  //   <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
  //     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{sectionLabel}</h3>
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       {fields.map(({ label, name }) => (
  //         <div key={name} className="flex flex-col">
  //           <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
  //           <input
  //             type="text"
  //             name={name}
  //             value={formData[section][name]}
  //             onChange={(e) => handleChange(section, name, e.target.value)}
  //             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
  //           />
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 backdrop-blur-sm'>
      <CloseModalButton onClick={onClose} className='fixed top-4 right-4' />
      <div className='bg-white dark:bg-[#1a1b1e] rounded-lg shadow-lg max-w-4xl w-full p-6 space-y-6 flex flex-col overflow-y-hidden max-h-[90vh]'>
        <div className='flex justify-between items-center border-b pb-4'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            Nueva Historia Clínica
          </h2>
          <button
                type='submit'
                className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-md text-sm'
              >
                Guardar
              </button>
        </div>
        <div className='mt-6 flex-1 overflow-y-auto pr-6 -mr-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Cédula */}
            <div className='flex flex-col'>
              <label className='text-sm text-gray-700 dark:text-gray-300'>
                Cédula del paciente
              </label>
              <input
                type='text'
                name='cedula'
                required
                pattern='^M-\d+$'
                value={formData.cedula}
                onChange={(e) =>
                  setFormData({ ...formData, cedula: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              />
            </div>

            {/* Datos Clínicos */}
            {renderFields("clinical_data", "Datos Clínicos", [
              {
                label: "Padecimiento actual",
                name: "padecimiento_actual",
                required: true,
              },
              {
                label: "Antecedentes heredofamiliares",
                name: "antecedentes_heredofamiliares",
              },
              {
                label: "Antecedentes personales",
                name: "antecedentes_personales",
              },
              {
                label: "Resto de aparatos y sistemas",
                name: "resto_aparatos_sistemas",
              },
              { label: "Tendencia a queloides", name: "cicatrices_queloides" },
              { label: "Tensión arterial", name: "tension_arterial" },
              { label: "Sangrado o hematomas", name: "sangrado_hematomas" },
              { label: "Ciclo menstrual", name: "ciclo_menstrual" },
              { label: "Tabaquismo", name: "tabaquismo" },
              { label: "Alcoholismo", name: "alcoholismo" },
              { label: "Problemas emocionales", name: "problemas_emocionales" },
            ])}

            {/* Alergias */}
            {renderFields("allergies", "Alergias", [
              { label: "Analgésicos", name: "analgesicos" },
              { label: "Anestésicos", name: "anestesicos" },
              { label: "Yodo", name: "yodo" },
              { label: "Adhesivos", name: "adhesivos" },
              { label: "Material de sutura", name: "material_sutura" },
              { label: "Otros", name: "otros" },
            ])}

            {/* Historia Médica General */}
            {renderFields("general_history", "Historia Médica General", [
              { label: "Topografía", name: "topografia" },
              { label: "Morfología", name: "morfologia" },
              { label: "Resto de piel y anexos", name: "resto_piel_anexos" },
            ])}

            {/* Diagnóstico */}
            {renderFields("diagnosis", "Diagnóstico", [
              {
                label: "Diagnóstico principal",
                name: "diagnostico_principal",
                required: true,
              },
              { label: "Otros diagnósticos", name: "otros_diagnosticos" },
            ])}

            {/* Fechas de Evolución */}
            {renderEvolutionDates("EvolutionDates", "Fechas de Evolución", [
              { label: "Fecha", name: "date", type: "date", disabled: true },
              { label: "Observaciones", name: "observation", required: true },
            ])}

            <div className='flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600 gap-2'>
              {/* Espacio para que el final del Modal no quede justo y muestre otra linea */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewHistoryModal;
