// Patients.jsx
import React, { useEffect } from 'react';
import usePatientStore from '../store/patientStore.js';
import Button from '../components/Button.jsx';
import PatientModal from '../components/PatientModal.jsx';
import { useState } from 'react';
import NewPatientModal from '../components/NewPatientModal';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('T')[0].split('-'); // fuerza fecha sin zona horaria
  const date = new Date(+year, month - 1, +day); // mes empieza desde 0

  const dayFormatted = String(date.getDate()).padStart(2, '0');
  const monthFormatted = date.toLocaleString('es-ES', { month: 'long' });
  const yearFormatted = date.getFullYear();

  return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
};


const Patients = () => {
  const {
    patients,
    loading,
    error,
    fetchPatients,
    openPatientModal,
    showModal,
    patient,
    closePatientModal,
  } = usePatientStore();

  const [showNewModal, setShowNewModal] = useState(false);

  console.log(patients, "<================PACIENTES");

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    const initials = parts.map((p) => p.charAt(0).toUpperCase()).slice(0, 2);
    return initials.join('');
  };

  return (
    <div className="p-4">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className="text-2xl font-bold mb-6 dark:text-[#e5e7eb]">Pacientes</h1>
        <button
          className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm w-full sm:w-auto'
          onClick={() => setShowNewModal(true)}
        >
          + Nuevo Usuario
        </button>
      </div>

      {loading && <p className="text-gray-500">Cargando pacientes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && patients.length > 0 && (
        <table className="hidden sm:table min-w-[700px] w-full bg-white dark:bg-[#2a2b2f] rounded-lg shadow-md text-sm">
          <thead className="bg-[#e1e5e9] dark:bg-[#1f2023] text-[#1f2937] dark:text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Cédula</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Sexo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Edad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fecha de Nacimiento</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-[#f3f4f6] dark:hover:bg-[#1f2023] transition"
                onClick={() => openPatientModal(patient)}
              >
                <td className="px-4 py-3 flex items-center whitespace-nowrap">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full mr-3 bg-[#a78bfa] dark:bg-[#4f46e5]">
                    <div className="text-white font-medium">
                      {getInitials(patient.nombre)}
                    </div>
                  </div>
                  <span className=" font-medium">{patient.nombre}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{patient.cedula}</td>
                <td className="px-4 py-3 whitespace-nowrap">{patient.sexo}</td>
                <td className="px-4 py-3 whitespace-nowrap">{patient.edad}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(patient.fecha_nacimiento)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Button className={"w-2/3"}>Ver Historia Clínica</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Cards para móviles */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {patients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => openPatientModal(patient)}
            className="bg-white dark:bg-[#2a2b2f] rounded-lg shadow p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1f2023] transition"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] text-white font-semibold">
                {getInitials(patient.nombre)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {patient.nombre} {patient.apellido}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cédula: {patient.cedula}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p>Sexo: {patient.sexo}</p>
              <p>Edad: {patient.edad}</p>
              <p>F. Nac: {formatDate(patient.fecha_nacimiento)}</p>
            </div>

            <div className="mt-4">
              <Button className="w-full text-sm">Ver Historia Clínica</Button>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && patients.length === 0 && (
        <p className="text-white">No hay pacientes registrados.</p>
      )}

      {showModal && patient && <PatientModal patient={patient} onClose={closePatientModal} />}
      {showNewModal && <NewPatientModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
};

export default Patients;