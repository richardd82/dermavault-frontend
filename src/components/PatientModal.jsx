// PatientModal.jsx
import React, { useState } from 'react';
import usePatientStore from '../store/patientStore';
import clsx from 'clsx';
import toast from "react-hot-toast";
import useSearchStore from '../store/searchStore';



const PatientModal = ({ patient, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...patient });
    const { editPatient } = usePatientStore();
    const { clearSelectedPatient } = useSearchStore();

    // console.log(patient, "<================PACIENTES");    

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === "fecha_nacimiento") {
            const edadCalculada = calcularEdad(value);
            updatedFormData.edad = edadCalculada;
        }

        setFormData(updatedFormData);
    };

    const handleClose = () => {
        clearSelectedPatient(); // 🧼 limpia desde el store
        if (onClose) onClose();  // ⛔ solo si estás pasándolo también por props
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

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return '';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
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
                        {editMode ? (
                            <>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {/* Labels en modo edición */}
                                    <div className="flex-1 flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre(s)</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                            placeholder="Nombre(s)"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-right sm:text-left">Apellido(s)</label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido || ''}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                            placeholder="Apellidos"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre Completo</label>
                                <p className="text-gray-900 dark:text-gray-100">{getFullName()}</p>
                            </>
                        )}
                    </div>
                    {renderField('Cédula', 'cedula')}
                    {/* Fecha de Nacimiento */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Fecha de Nacimiento
                        </label>
                        {editMode ? (
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento?.split("T")[0] || ''}
                                onChange={handleChange}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100">{formData.fecha_nacimiento || '-'}</p>
                        )}
                    </div>

                    {/* Edad */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Edad</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="edad"
                                value={formData.edad || ''}
                                readOnly
                                disabled
                                className="cursor-not-allowed border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100">{formData.edad || '-'}</p>
                        )}
                    </div>
                    {/* Sexo */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Sexo
                        </label>
                        {editMode ? (
                            <select
                                name="sexo"
                                value={formData.sexo || ''}
                                onChange={handleChange}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            >
                                <option value="">Selecciona</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100">{formData.sexo || '-'}</p>
                        )}
                    </div>

                    {/* Estado Civil */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Estado Civil
                        </label>
                        {editMode ? (
                            <select
                                name="estado_civil"
                                value={formData.estado_civil || ''}
                                onChange={handleChange}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            >
                                <option value="">Selecciona</option>
                                <option value="Soltero">Soltero</option>
                                <option value="Casado">Casado</option>
                                <option value="Viudo">Viudo</option>
                                <option value="Divorciado">Divorciado</option>
                            </select>
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100">{formData.estado_civil || '-'}</p>
                        )}
                    </div>



                    {/* {renderField('Edad', 'edad')} */}
                    {renderField('Lugar de Nacimiento', 'lugar_nacimiento')}
                    {renderField('Profesión', 'profesion')}
                    {renderField('Teléfono Casa', 'telefono_casa')}
                    {renderField('Teléfono Móvil', 'telefono_movil')}
                    {renderField('Teléfono Trabajo', 'telefono_trabajo')}
                    {renderField('Email', 'email')}
                    {renderField('Referido por', 'referido_por')}
                    {renderField('Dirección', 'direccion', true)}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleClose}
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