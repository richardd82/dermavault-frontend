import React, { useState } from 'react';
import usePatientStore from '../store/patientStore';
import clsx from 'clsx';
import toast from "react-hot-toast";


const NewPatientModal = ({ onClose }) => {
    const { createPatient } = usePatientStore();

    const [formData, setFormData] = useState({
        cedula: 'M-',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        edad: '',
        lugar_nacimiento: '',
        sexo: '',
        estado_civil: '',
        profesion: '',
        telefono_casa: '',
        telefono_trabajo: '',
        telefono_movil: '',
        email: '',
        referido_por: '',
        direccion: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        const res = await createPatient(formData);
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
            toast.success("El usuario se creó correctamente", {
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
    }
        const renderField = (label, name, multiline = false) => (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                {multiline ? (
                    <textarea
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none"
                        required
                    />
                ) : (
                    <input
                        type="text"
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                        required
                    />
                )}
            </div>
        );

        return (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Registrar Paciente</h2>
                        <button
                            onClick={handleSubmit}
                            className={clsx(
                                'text-white px-4 py-2 rounded-md transition-colors',
                                'bg-[#a78bfa] dark:bg-[#4f46e5]'
                            )}
                        >
                            Guardar Paciente
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderField('Cédula', 'cedula')}
                        {/* Nombre y Apellido separados */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            />
                        </div>

                        {renderField('Fecha de Nacimiento', 'fecha_nacimiento')}
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
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    export default NewPatientModal;
