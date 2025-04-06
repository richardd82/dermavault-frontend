import React, { useState } from "react";
import usePatientStore from "../store/patientStore";
import clsx from "clsx";
import toast from "react-hot-toast";


const requiredFields = [
  "cedula",
  "nombre",
  "apellido",
  "fecha_nacimiento",
  "edad",
  "sexo",
  "telefono_movil",
  "email",
];

const NewPatientModal = ({ onClose }) => {
  const { createPatient } = usePatientStore();

  const [formData, setFormData] = useState({
    cedula: "M-",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    edad: "",
    lugar_nacimiento: "",
    sexo: "",
    estado_civil: "",
    profesion: "",
    telefono_casa: "",
    telefono_trabajo: "",
    telefono_movil: "",
    email: "",
    referido_por: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field]?.trim();
      if (!value) {
        newErrors[field] = "Este campo es requerido";
      } else {
        if (field === "cedula" && value === "M-") {
          newErrors[field] = 'Debe contener más caracteres después de "M-"';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };

    // Calcular edad si cambia la fecha
    if (name === "fecha_nacimiento") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updatedForm.edad = age > 0 ? age.toString() : "";
    }

    setFormData(updatedForm);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
   
      const formattedData = {
        ...formData,
        fecha_nacimiento: formatDateForBackend(formData.fecha_nacimiento),
      };
      const res =await createPatient(formattedData);
      if (!res.success) {
        toast.error("Error al guardar el usuario: " + err.response.data.message, {
          duration: 5000,
          style: {
            background: "#4f46e5", // color de fondo
            color: "#fff", // color del texto
            fontSize: "14px", // tamaño de fuente
            padding: "16px 20px", // espaciado interno
            borderRadius: "8px", // bordes redondeados
          },
        });
      } else {
        //mensaje de error de toast
        toast.success("El usuario se guardó correctamente", {
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
      }
  };

  const renderField = (label, name, multiline = false) => (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
        {label}
        {requiredFields.includes(name) && (
          <span className='text-red-500'> *</span>
        )}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={clsx(
            "border rounded-md px-3 py-2 resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100",
            errors[name]
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          )}
        />
      ) : (
        <input
          type='text'
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={clsx(
            "border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100",
            errors[name]
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          )}
        />
      )}
      {errors[name] && (
        <span className='text-sm text-red-500'>{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4'>
      <div className='bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
            Registrar Paciente
          </h2>
          <button
            onClick={handleSubmit}
            className='text-white px-4 py-2 rounded-md transition-colors bg-[#a78bfa] dark:bg-[#4f46e5]'
          >
            Guardar Paciente
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {renderField("Cédula", "cedula")}
          {renderField("Nombre", "nombre")}
          {renderField("Apellido", "apellido")}

          {/* Fecha de nacimiento */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Fecha de Nacimiento <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              name='fecha_nacimiento'
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className={clsx(
                "border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100",
                errors.fecha_nacimiento
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              )}
            />
            {errors.fecha_nacimiento && (
              <span className='text-sm text-red-500'>
                {errors.fecha_nacimiento}
              </span>
            )}
          </div>

          {/* Edad (readonly) */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Edad
            </label>
            <input
              type='text'
              name='edad'
              value={formData.edad}
              readOnly
              disabled
              className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 cursor-not-allowed'
            />
          </div>

          {renderField("Lugar de Nacimiento", "lugar_nacimiento")}

          {/* Sexo */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Sexo <span className='text-red-500'>*</span>
            </label>
            <select
              name='sexo'
              value={formData.sexo}
              onChange={handleChange}
              className={clsx(
                "border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100",
                errors.sexo
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <option value=''>Selecciona</option>
              <option value='M'>Masculino</option>
              <option value='F'>Femenino</option>
              <option value='O'>Otro</option>
            </select>
            {errors.sexo && (
              <span className='text-sm text-red-500'>{errors.sexo}</span>
            )}
          </div>

          {/* Estado Civil */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Estado Civil
            </label>
            <select
              name='estado_civil'
              value={formData.estado_civil}
              onChange={handleChange}
              className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
            >
              <option value=''>Selecciona</option>
              <option value='Soltero'>Soltero</option>
              <option value='Casado'>Casado</option>
              <option value='Viudo'>Viudo</option>
              <option value='Divorciado'>Divorciado</option>
            </select>
          </div>

          {renderField("Profesión", "profesion")}
          {renderField("Teléfono Casa", "telefono_casa")}
          {renderField("Teléfono Móvil", "telefono_movil")}
          {renderField("Teléfono Trabajo", "telefono_trabajo")}
          {renderField("Email", "email")}
          {renderField("Referido por", "referido_por")}
          {renderField("Dirección", "direccion", true)}
        </div>

        <div className='flex justify-end pt-2'>
          <button
            onClick={onClose}
            className='text-sm text-gray-600 dark:text-gray-300 hover:underline'
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPatientModal;

// import React, { useState } from "react";
// import usePatientStore from "../store/patientStore";
// import clsx from "clsx";
// import toast from "react-hot-toast";

// const requiredFields = [
//   "cedula",
//   "nombre",
//   "apellido",
//   "fecha_nacimiento",
//   "edad",
//   "sexo",
//   "telefono_movil",
//   "email",
// ];

// const NewPatientModal = ({ onClose }) => {
//   const { createPatient } = usePatientStore();

//   const [formData, setFormData] = useState({
//     cedula: "M-",
//     nombre: "",
//     apellido: "",
//     fecha_nacimiento: "",
//     edad: "",
//     lugar_nacimiento: "",
//     sexo: "",
//     estado_civil: "",
//     profesion: "",
//     telefono_casa: "",
//     telefono_trabajo: "",
//     telefono_movil: "",
//     email: "",
//     referido_por: "",
//     direccion: "",
//   });

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     requiredFields.forEach((field) => {
//       const value = formData[field]?.trim();

//       if (!value) {
//         newErrors[field] = "Este campo es requerido";
//       } else {
//         // Validación especial para cédula
//         if (field === "cedula" && value === "M-") {
//           newErrors[field] = 'Debe contener más caracteres después de "M-"';
//         }
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleChange = (e) => {
//   //     const { name, value } = e.target;
//   //     setFormData((prev) => ({ ...prev, [name]: value }));
//   //     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   // };
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     const updatedForm = { ...formData, [name]: value };

//     // Si cambia la fecha de nacimiento, recalcula la edad
//     if (name === "fecha_nacimiento") {
//       const birthDate = new Date(value);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const m = today.getMonth() - birthDate.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       updatedForm.edad = age.toString(); // asegura que sea string para los inputs
//     }

//     setFormData(updatedForm);
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     const res = await createPatient(formData);
//     if (!res.success) {
//       toast.error("Error al guardar el usuario: " + res.message, {
//         duration: 5000,
//         style: {
//           background: "#4f46e5", // color de fondo
//           color: "#fff", // color del texto
//           fontSize: "14px", // tamaño de fuente
//           padding: "16px 20px", // espaciado interno
//           borderRadius: "8px", // bordes redondeados
//         },
//       });
//     } else {
//       //mensaje de error de toast
//       toast.success("El usuario se creó correctamente", {
//         duration: 5000,
//         style: {
//           background: "#4f46e5", // color de fondo
//           color: "#fff", // color del texto
//           fontSize: "14px", // tamaño de fuente
//           padding: "16px 20px", // espaciado interno
//           borderRadius: "8px", // bordes redondeados
//         },
//       });
//       onClose();
//     }
//   };
//   const renderField = (label, name, multiline = false) => (
//     <div className='flex flex-col gap-1'>
//       <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
//         {label}
//         {requiredFields.includes(name) && (
//           <span className='text-red-500'> *</span>
//         )}
//       </label>

//       {multiline ? (
//         <textarea
//           name={name}
//           value={formData[name]}
//           onChange={handleChange}
//           className={clsx(
//             "border rounded-md px-3 py-2 ...",
//             errors[name]
//               ? "border-red-500 dark:border-red-400"
//               : "border-gray-300 dark:border-gray-600"
//           )}
//           required
//         />
//       ) : (
//         <input
//           type='text'
//           name={name}
//           value={formData[name]}
//           onChange={handleChange}
//           className={clsx(
//             "border rounded-md px-3 py-2 ...",
//             errors[name]
//               ? "border-red-500 dark:border-red-400"
//               : "border-gray-300 dark:border-gray-600"
//           )}
//           required
//         />
//       )}
//       {errors[name] && (
//         <span className='text-sm text-red-500'>{errors[name]}</span>
//       )}
//     </div>
//   );

//   return (
//     <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4'>
//       <div className='bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]'>
//         <div className='flex justify-between items-center'>
//           <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
//             Registrar Paciente
//           </h2>
//           <button
//             onClick={handleSubmit}
//             className={clsx(
//               "text-white px-4 py-2 rounded-md transition-colors",
//               "bg-[#a78bfa] dark:bg-[#4f46e5]"
//             )}
//           >
//             Guardar Paciente
//           </button>
//         </div>

//         <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//           {renderField("Cédula", "cedula")}
//           {/* Nombre y Apellido separados */}
//           <div className='flex flex-col gap-1'>
//             <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
//               Nombre
//             </label>
//             <input
//               type='text'
//               name='nombre'
//               value={formData.nombre}
//               onChange={handleChange}
//               className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
//             />
//           </div>
//           <div className='flex flex-col gap-1'>
//             <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
//               Apellido
//             </label>
//             <input
//               type='text'
//               name='apellido'
//               value={formData.apellido}
//               onChange={handleChange}
//               className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
//             />
//           </div>

//           {renderField(
//             "Fecha de Nacimiento ej.(1950-12-31)",
//             "fecha_nacimiento"
//           )}
//           {renderField("Edad", "edad")}
//           {renderField("Lugar de Nacimiento", "lugar_nacimiento")}
//           {renderField("Sexo", "sexo")}
//           {renderField("Estado Civil", "estado_civil")}
//           {renderField("Profesión", "profesion")}
//           {renderField("Teléfono Móvil", "telefono_movil")}
//           {renderField("Email", "email")}
//           {renderField("Referido por", "referido_por")}
//           {renderField("Dirección", "direccion", true)}
//         </div>

//         <div className='flex justify-end pt-2'>
//           <button
//             onClick={onClose}
//             className='text-sm text-gray-600 dark:text-gray-300 hover:underline'
//           >
//             Cancelar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewPatientModal;
