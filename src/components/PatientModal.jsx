// PatientModal.jsx
import React, { useState } from 'react';
import usePatientStore from '../store/patientStore';
import clsx from 'clsx';
import toast from "react-hot-toast";


const PatientModal = ({ patient, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...patient });

    const { editPatient } = usePatientStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggleEdit = async () => {
        if (editMode) {
            
                const res = await editPatient(patient.id, formData);
                setEditMode(false);
                if (!res.success) {
                    toast.error("Error al guardar el usuario: " + res.message, {
                        duration: 5000,
                        style: {
                            background: "#4f46e5",       // color de fondo
                            color: "#fff",               // color del texto
                            fontSize: "14px",            // tamaño de fuente
                            padding: "16px 20px",        // espaciado interno
                            borderRadius: "8px",         // bordes redondeados
                        },
                    });

                } else {
                    //mensaje de error de toast
                    toast.success("El usuario se guardó correctamente", {
                        duration: 5000,
                        style: {
                            background: "#4f46e5",       // color de fondo
                            color: "#fff",               // color del texto
                            fontSize: "14px",            // tamaño de fuente
                            padding: "16px 20px",        // espaciado interno
                            borderRadius: "8px",         // bordes redondeados
                        },
                    });
                    onClose();
                };

            
        } else {
            setEditMode(true);
        }
    };

    const getFullName = () => {
        return `${formData.nombre || ''} ${formData.apellido || ''}`.trim();
    };

    const renderField = (label, name, multiline = false) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
            {editMode ? (
                multiline ? (
                    <textarea
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none"
                    />
                ) : (
                    <input
                        type="text"
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    />
                )
            ) : (
                <p className="text-gray-900 dark:text-gray-100">{formData[name] || '-'}</p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Información del Paciente</h2>
                    <button
                        onClick={handleToggleEdit}
                        className={clsx(
                            'text-white px-4 py-2 rounded-md transition-colors',
                            editMode ? 'bg-[#4f46e5] dark:bg-[#a78bfa]' : 'bg-[#a78bfa] dark:bg-[#4f46e5]'
                        )}
                    >
                        {editMode ? 'Guardar' : 'Editar Paciente'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campo personalizado para nombre completo */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre Completo</label>
                        {editMode ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                    placeholder="Nombre(s)"
                                />
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                    placeholder="Apellidos"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100">{getFullName()}</p>
                        )}
                    </div>

                    {renderField('Cédula', 'cedula')}
                    {renderField('Fecha de Nacimiento ej.(1950-12-31)', 'fecha_nacimiento')}
                    {renderField('Edad', 'edad')}
                    {renderField('Lugar de Nacimiento', 'lugar_nacimiento')}
                    {renderField('Sexo', 'sexo')}
                    {renderField('Estado Civil', 'estado_civil')}
                    {renderField('Profesión', 'profesion')}
                    {renderField('Teléfono Móvil', 'telefono_movil')}
                    {renderField('Email', 'email')}
                    {renderField('Referido por', 'referido_por')}
                    {renderField('Dirección', 'direccion', true)}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientModal;

// PatientModal.jsx
// import React, { useState } from 'react';
// import usePatientStore from '../store/patientStore';
// import clsx from 'clsx';

// const PatientModal = ({ patient, onClose }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({ ...patient });

//   const { editPatient } = usePatientStore();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleToggleEdit = async () => {
//     if (editMode) {
//       try {
//         await editPatient(patient.id, formData);
//         setEditMode(false);
//       } catch (err) {
//         err('Error al guardar los cambios');
//       }
//     } else {
//       setEditMode(true);
//     }
//   };

//   const getFullName = () => {
//     return `${formData.nombre || ''} ${formData.apellido || ''}`.trim();
//   };

//   const renderField = (label, name, multiline = false) => (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
//       {editMode ? (
//         multiline ? (
//           <textarea
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleChange}
//             className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none"
//           />
//         ) : (
//           <input
//             type="text"
//             name={name}
//             value={formData[name] || ''}
//             onChange={handleChange}
//             className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
//           />
//         )
//       ) : (
//         <p className="text-gray-900 dark:text-gray-100">{formData[name] || '-'}</p>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
//       <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Información del Paciente</h2>
//           <button
//             onClick={handleToggleEdit}
//             className={clsx(
//               'text-white px-4 py-2 rounded-md transition-colors',
//               editMode ? 'bg-[#4f46e5] dark:bg-[#a78bfa]' : 'bg-[#a78bfa] dark:bg-[#4f46e5]'
//             )}
//           >
//             {editMode ? 'Guardar' : 'Editar Paciente'}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Campo personalizado para nombre completo */}
//           <div className="flex flex-col gap-1 sm:col-span-2">
//             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre Completo</label>
//             {editMode ? (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <input
//                   type="text"
//                   name="nombre"
//                   value={formData.nombre || ''}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
//                   placeholder="Nombre(s)"
//                 />
//                 <input
//                   type="text"
//                   name="apellido"
//                   value={formData.apellido || ''}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
//                   placeholder="Apellidos"
//                 />
//               </div>
//             ) : (
//               <p className="text-gray-900 dark:text-gray-100">{getFullName()}</p>
//             )}
//           </div>

//           {renderField('Cédula', 'cedula')}
//           {renderField('Fecha de Nacimiento', 'fecha_nacimiento')}
//           {renderField('Edad', 'edad')}
//           {renderField('Lugar de Nacimiento', 'lugar_nacimiento')}
//           {renderField('Sexo', 'sexo')}
//           {renderField('Estado Civil', 'estado_civil')}
//           {renderField('Profesión', 'profesion')}
//           {renderField('Teléfono Móvil', 'telefono_movil')}
//           {renderField('Email', 'email')}
//           {renderField('Referido por', 'referido_por')}
//           {renderField('Dirección', 'direccion', true)}
//         </div>

//         <div className="flex justify-end pt-2">
//           <button
//             onClick={onClose}
//             className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
//           >
//             Cerrar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientModal;
