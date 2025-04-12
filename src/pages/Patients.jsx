// Patients.jsx
import React, { useEffect } from "react";
import usePatientStore from "../store/patientStore.js";
import Button from "../components/Button.jsx";
import PatientModal from "../components/PatientModal.jsx";
import { useState } from "react";
import NewPatientModal from "../components/NewPatientModal";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import HistoryDetailModal from "../components/HistoryDetailModal";
import NewHistoryModal from "../components/NewHistoryModal";
import useSearchStore from "../store/searchStore";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-"); // fuerza fecha sin zona horaria
  const date = new Date(+year, month - 1, +day); // mes empieza desde 0

  const dayFormatted = String(date.getDate()).padStart(2, "0");
  const monthFormatted = date.toLocaleString("es-ES", { month: "long" });
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

  const { patientQuery, patientResults, clearPatientSearch } = useSearchStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null); // Para mostrar el modal con los datos de la historia si ya existe
  const [creatingHistoryFor, setCreatingHistoryFor] = useState(null); // Para crear una historia nueva
  const { getHistoryByCedula, histories, getHistories } =
    useMedicalHistoryStore();

  // console.log(patients, "<================PACIENTES");

  const total = patientQuery.trim()
    ? patientResults.length
    : patients.length;

  useEffect(() => {
    fetchPatients();
    getHistories();
    return () => {
      clearPatientSearch();
    };
  }, [fetchPatients]);

  useEffect(() => {
    // Este efecto asegura que cuando cambie la búsqueda, se actualicen los datos visibles
    // y evita que se quede "congelado" en mobile.
  }, [patientQuery, patientResults]);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    const initials = parts.map((p) => p.charAt(0).toUpperCase()).slice(0, 2);
    return initials.join("");
  };

  const handleHistoryClick = async (patient) => {
    try {
      const result = await getHistoryByCedula(patient.cedula);

      if (result && result.id) {
        setSelectedHistory(result);
      } else {
        setCreatingHistoryFor(patient);
      }
    } catch (error) {
      console.error("Error al obtener historia clínica:", error);
      setCreatingHistoryFor(patient);
    }
  };


  const dataToShow = patientQuery.length > 1 ? patientResults : patients;

  return (
    <div className='p-0' >
      <div className='sticky top-[0px] md:top-[0px] z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 pt-4 pb-3'>
          <h1 className='text-2xl font-bold dark:text-[#e5e7eb]'>Pacientes</h1>
          <p className="text-1xl font-bold text-gray-600 dark:text-gray-300 mt-2">
            Mostrando {total} {total === 1 ? 'registro' : 'registros'}{patientQuery && ` para "${patientQuery}"`}
          </p>
          <button
            className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm w-full sm:w-auto'
            onClick={() => setShowNewModal(true)}
          >
            + Nuevo Paciente
          </button>
        </div>
      </div>

      {loading && <p className='text-gray-500'>Cargando pacientes...</p>}
      {error && <p className='text-red-500'>Error: {error}</p>}

      {!loading && !error && patients.length > 0 && (
        <div className="lg: overflow-y-auto max-h-[calc(100vh-160px)] pr-6 pl-6 pt-0 sm:max-h-[80vh] xl:max-h-[81vh] 2xl:max-h-[80vh] ">
          <table className='hidden md:table min-w-[700px] w-full bg-white dark:bg-[#2a2b2f] rounded-lg shadow-md text-sm '>
            <thead className='sticky top-0 z-10 bg-[#e1e5e9] dark:bg-[#1f2023] text-[#1f2937] dark:text-white text-sm'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'>
                  Nombre
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'>
                  Cédula
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'>
                  Sexo
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'>
                  Edad
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'>
                  Fecha de Nacimiento
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold md:max-lg:px-2 md:max-lg:py-2 md:max-lg:text-xs'></th>
              </tr>
            </thead>
            <tbody>
              {dataToShow.map((patient) => (
                <tr
                  key={patient.id}
                  className='cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-[#f3f4f6] dark:hover:bg-[#1f2023] transition'
                  onClick={() => openPatientModal(patient)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 md:max-lg:gap-1 md:max-lg:flex-nowrap">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] md:max-lg:h-8 md:max-lg:w-8">
                        <div className="text-white font-medium text-sm md:max-lg:text-xs">
                          {getInitials(patient.nombre)}
                        </div>
                      </div>
                      <span className="font-medium md:max-lg:text-xs">
                        {patient.nombre}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {patient.cedula}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>{patient.sexo}</td>
                  <td className='px-4 py-3 whitespace-nowrap'>{patient.edad}</td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {formatDate(patient.fecha_nacimiento)}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <Button
                      className='md:max-lg:w-full md:max-lg:text-xs md:max-lg:px-2 md:max-lg:py-1 h-10'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistoryClick(patient);
                        window.history.pushState({}, "", "/medicalhistories");
                      }}
                    >
                      {histories.find((h) => h.patient_id === patient.id)
                        ? "Ver Historia Clínica"
                        : "Crear Historia Clínica"}
                    </Button>
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Cards para móviles */}
      <div className='grid grid-cols-1 gap-4 md:hidden overflow-y-auto h-[calc(100dvh-180px)] px-2 pb-4'>
        {dataToShow.map((patient) => (
          <div
            key={patient.id}
            onClick={() => openPatientModal(patient)}
            className='bg-white dark:bg-[#2a2b2f] rounded-lg shadow p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1f2023] transition'
          >
            <div className='flex items-center gap-4 mb-3'>
              <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] text-white font-semibold'>
                {getInitials(patient.nombre)}
              </div>
              <div>
                <p className='font-semibold text-gray-800 dark:text-white'>
                  {patient.nombre} {patient.apellido}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Cédula: {patient.cedula}
                </p>
              </div>
            </div>

            <div className='text-sm text-gray-700 dark:text-gray-300'>
              <p>Sexo: {patient.sexo}</p>
              <p>Edad: {patient.edad}</p>
              <p>F. Nac: {formatDate(patient.fecha_nacimiento)}</p>
            </div>

            <div className='mt-4'>

              <Button
                className='w-full text-sm'
                onClick={(e) => {
                  e.stopPropagation();
                  handleHistoryClick(patient);
                  window.history.pushState({}, "", "/medicalhistories");
                }}
              >
                {histories.find((h) => h.patient_id === patient.id)
                  ? "Ver Historia Clínica"
                  : "Crear Historia Clínica"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && patients.length === 0 && (
        <p className='text-white'>No hay pacientes registrados.</p>
      )}

      {showModal && patient && (
        <PatientModal patient={patient} onClose={closePatientModal} />
      )}
      {showNewModal && (
        <NewPatientModal onClose={() => setShowNewModal(false)} />
      )}

      {selectedHistory && (
        <HistoryDetailModal
          history={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}

      {creatingHistoryFor && (
        <NewHistoryModal
          onClose={() => setCreatingHistoryFor(null)}
          prefillCedula={creatingHistoryFor.cedula}
        />
      )}
    </div>
  );
};

export default Patients;
