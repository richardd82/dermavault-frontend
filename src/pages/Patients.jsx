// Patients.jsx (o .tsx si usas TypeScript)
import React, { useEffect } from 'react';
import usePatientStore from '../store/patientStore.js';
import Button from '../components/Button.jsx';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // evita errores si viene algo no válido

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const Patients = () => {
  const { patients, loading, error, fetchPatients } = usePatientStore();
  console.log(patients, "pacientes desde el Patients Component")
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Función auxiliar para crear las iniciales (ej. "Laura Garcia" => "LG")
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
        // onClick={() => setShowModal(true)}
        >
          + Nuevo Usuario
        </button>
      </div>
      {/* Mensajes de carga o error */}
      {loading && <p className="text-gray-500">Cargando pacientes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Tabla de pacientes */}
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
              <tr key={patient.id} className="cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-[#f3f4f6] dark:hover:bg-[#1f2023] transition">
                {/* Columna Nombre (con avatar circular e iniciales) */}
                <td className="px-4 py-3 flex items-center whitespace-nowrap">
                  <div
                    className="h-10 w-10 flex items-center justify-center rounded-full mr-3 bg-[#a78bfa] dark:bg-[#4f46e5]"
                  >
                    <div className="text-white font-medium">
                      {getInitials(patient.nombre)}
                    </div>
                  </div>
                  <span className=" font-medium">{patient.nombre}</span>
                </td>

                {/* Columna CURP */}
                <td className="px-4 py-3  whitespace-nowrap">
                  {patient.cedula}
                </td>

                {/* Columna Sexo */}
                <td className="px-4 py-3  whitespace-nowrap">
                  {patient.sexo}
                </td>

                {/* Columna Edad */}
                <td className="px-4 py-3  whitespace-nowrap">
                  {patient.edad}
                </td>

                {/* Columna Fecha de Nacimiento */}
                <td className="px-4 py-3  whitespace-nowrap">
                  {formatDate(patient.fecha_nacimiento)}
                </td>

                {/* Botón Ver Historia Clínica */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Button className={"w-2/3"}>
                    Ver Historia Clínica
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mensaje cuando no hay pacientes */}
      {!loading && !error && patients.length === 0 && (
        <p className="text-white">No hay pacientes registrados.</p>
      )}
    </div>
  );
};

export default Patients;
