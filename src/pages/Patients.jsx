import React, { useEffect, useState, useRef, useCallback } from "react";
import usePatientPaginationStore from "../store/patientPaginationStore";
import usePatientStore from "../store/patientStore";
import Button from "../components/Button.jsx";
import PatientModal from "../components/PatientModal.jsx";
import NewPatientModal from "../components/NewPatientModal";
import useMedicalHistoryStore from "../store/medicalHistoryStore";
import HistoryDetailModal from "../components/HistoryDetailModal";
import NewHistoryModal from "../components/NewHistoryModal";
import useSearchStore from "../store/searchStore";
import useDebounce from "../hooks/useDebounce.js";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  const date = new Date(+year, month - 1, +day);
  return `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString(
    "es-ES",
    { month: "long" }
  )}-${date.getFullYear()}`;
};

const Patients = () => {
  const { patients, loading, error, fetchMorePatients, hasMore } =
    usePatientPaginationStore();

  const {
    openPatientModal,
    showModal,
    patient,
    closePatientModal,
    patientsCount,
    fetchPatientsCount,
  } = usePatientStore();

  const {
    patientQuery,
    patientResults,
    clearPatientSearch,
    searchPatients,
    loadingPatients,
  } = useSearchStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [creatingHistoryFor, setCreatingHistoryFor] = useState(null);
  const { getHistoryByCedula } = useMedicalHistoryStore();
  const { getAllHistoryCedulas } = useSearchStore();
  const [hasHistoryMap, setHistoryMap] = useState(new Map());
  const debouncedQuery = useDebounce(patientQuery, 300);
  const scrollContainerRef = useRef(null);
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getAllHistoryCedulas().then((hc) => {
      const map = new Map(hc.map((h) => [h.patient_id, h.cedula]));
      setHistoryMap(map);
    });
  }, []);

  useEffect(() => {
    if (patients.length === 0) {
      fetchMorePatients();
    }
    getAllHistoryCedulas();
    return () => clearPatientSearch();
  }, []);

  useEffect(() => {
    fetchPatientsCount();
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || !hasMore || patientQuery.trim().length > 0) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchMorePatients();
          }
        },
        {
          root: scrollContainerRef.current,
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMorePatients, patientQuery]
  );

  const getInitials = (fullName) =>
    fullName
      ? fullName
          .split(" ")
          .map((p) => p[0]?.toUpperCase())
          .slice(0, 2)
          .join("")
      : "";
  // console.log("Pacientes:", patients);
  const handleHistoryClick = async (patient) => {
    try {
      const result = await getHistoryByCedula(patient.cedula);
      result?.id ? setSelectedHistory(result) : setCreatingHistoryFor(patient);
    } catch (error) {
      console.error("Error al obtener historia clínica:", error);
      setCreatingHistoryFor(patient);
    }
  };

  const truncate = (text, maxLength = 20) =>
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  const isSearching = patientQuery.length >= 1;
  const dataToShow = isSearching ? patientResults : patients;

  const total = dataToShow.length;

  const Overlay = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin'></div>
    </div>
  );

  if (loadingPatients) return <Overlay />;

  return (
    <div className='p-0 relative'>
      <div className='sticky top-0 z-20 bg-[#f8f9fa] dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 pt-4 pb-3'>
          <h1 className='text-2xl font-bold dark:text-[#e5e7eb]'>Pacientes</h1>
          <p className='text-1xl font-bold text-gray-600 dark:text-gray-300 mt-2'>
            Mostrando {total} {total === 1 ? "registro" : "registros"} de{" "}{patientsCount} pacientes
            {patientQuery && ` para "${patientQuery}"`}
          </p>
          <button
            className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm w-full sm:w-auto'
            onClick={() => setShowNewModal(true)}
          >
            + Nuevo Paciente
          </button>
        </div>
      </div>

      {/* {loading && <p className='text-gray-500 px-4'>Cargando pacientes...</p>} */}
      {error && <p className='text-red-500 px-4'>Error: {error}</p>}

      <div
        className='overflow-x-auto max-h-[calc(100vh-160px)] px-4'
        ref={scrollContainerRef}
      >
        <table className='hidden lg:table w-full table-fixed bg-white dark:bg-[#2a2b2f] rounded-lg shadow-md text-sm'>
          <thead className='sticky top-0 z-10 bg-[#e1e5e9] dark:bg-[#1f2023] text-[#1f2937] dark:text-white'>
            <tr>
              <th className='w-[25%] px-4 py-3 text-left font-semibold'>
                Nombre
              </th>
              <th className='w-[25%] px-4 py-3 text-left font-semibold'>
                Apellido
              </th>
              <th className='w-[15%] px-4 py-3 text-left font-semibold'>
                Cédula
              </th>
              <th className='w-[10%] px-4 py-3 text-left font-semibold'>
                Sexo
              </th>
              <th className='w-[10%] px-4 py-3 text-left font-semibold'>
                Edad
              </th>
              <th className='w-[20%] px-4 py-3 text-left font-semibold'>
                Fecha de Nacimiento
              </th>
              <th className='w-[20%] px-4 py-3 text-left font-semibold'></th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.map((patient, index) => {
              const isLast = index === dataToShow.length - 1;
              return (
                <tr
                  key={patient.id}
                  ref={
                    window.innerWidth >= 768 && isLast ? lastElementRef : null
                  }
                  onClick={() => openPatientModal(patient)}
                  className='cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-[#f3f4f6] dark:hover:bg-[#1f2023]'
                >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#a78bfa] dark:bg-[#4f46e5]'>
                        <div className='text-white font-medium text-sm'>
                          {getInitials(patient.nombre)}
                        </div>
                      </div>
                      <span className='font-medium'>
                        {truncate(patient.nombre)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className='px-4 py-3'>                      
                      <span className='font-medium'>
                        {truncate(patient.apellido)}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3'>{patient.cedula}</td>
                  <td className='px-4 py-3'>{patient.sexo}</td>
                  <td className='px-4 py-3'>{patient.edad}</td>
                  <td className='px-4 py-3 md:text-xs lg:text-sm'>
                    {formatDate(patient.fecha_nacimiento)}
                  </td>
                  <td className='px-4 py-3'>
                    <Button
                      className='w-[250px] text-sm md:h-12'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistoryClick(patient);
                        navigate("/patients");
                      }}
                    >
                      {hasHistoryMap.has(patient.id)
                        ? "Ver Historia Clínica"
                        : "Crear Historia Clínica"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* {Mobile} */}
        <div className='grid grid-cols-1 mt-2 gap-4 lg:hidden'>
          {dataToShow.map((patient, index) => {
            const isLast = index === dataToShow.length - 1;
            return (
              <div
                key={patient.id}
                ref={window.innerWidth < 768 && isLast ? lastElementRef : null}
                onClick={() => openPatientModal(patient)}
                className='bg-white dark:bg-[#2a2b2f] rounded-lg shadow p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1f2023]'
              >
                <div className='flex items-center gap-4 mb-3'>
                  <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] text-white font-semibold'>
                    {getInitials(patient.nombre)}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800 dark:text-white'>
                      {truncate(patient.nombre)} 
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
                      navigate("/patients");
                    }}
                  >
                    {hasHistoryMap.has(patient.id)
                      ? "Ver Historia Clínica"
                      : "Crear Historia Clínica"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
