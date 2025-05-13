import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAdministrativeDataStore from "../store/administrativeDataStore";

const AdminData = ({ patient }) => {
  const { getAdminDataByPatientId, saveAdminData } = useAdministrativeDataStore();
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (patient?.id) {
      getAdminDataByPatientId(patient.id).then((res) => {
        console.log(res, "getAdminDataByPatientId")
        setData(
          res || {
            no_cheque: "",
            no_recibo: "",
            rfc: "",
            cortesia: false,
          }
        );
      });
    }
  }, [patient]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "cortesia" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveAdminData(patient.id, data);
      toast.success("Datos administrativos guardados correctamente");
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar datos administrativos:", error);
      toast.error("Error al guardar los datos administrativos");
    }
  };

  return (
    <div className="space-y-6">
      {/* Datos del Paciente al estilo ficha médica */}
      <div className="space-y-2 border-b pb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">
          Paciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Nombre</strong><br />
            <span className="text-gray-900 dark:text-gray-100">{patient?.nombre} {patient?.apellido}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Cédula</strong><br />
            <span className="text-gray-900 dark:text-gray-100">{patient?.cedula}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Correo</strong><br />
            <span className="text-gray-900 dark:text-gray-100">{patient?.email || "Vacío"}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Teléfono móvil</strong><br />
            <span className="text-gray-900 dark:text-gray-100">{patient?.telefono_movil || "Vacío"}</span>
          </p>
        </div>
      </div>

      {/* Datos Administrativos */}
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Datos Administrativos
          </h3>
          <button
            onClick={editMode ? handleSave : () => setEditMode(true)}
            className="text-sm text-white bg-[#a78bfa] dark:bg-[#4f46e5] px-4 py-1 rounded-md hover:opacity-90 transition"
          >
            {editMode ? "Guardar" : "Editar"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "No. de Cheque", name: "no_cheque" },
            { label: "No. de Recibo", name: "no_recibo" },
            { label: "RFC", name: "rfc" },
          ].map(({ label, name }) => (
            <div className="flex flex-col gap-1" key={name}>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</label>
              {editMode ? (
                <input
                  type="text"
                  name={name}
                  value={data?.[name] || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{data?.[name] || "Vacío"}</span>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">Cortesía</label>
            {editMode ? (
              <select
                name="cortesia"
                value={data?.cortesia ? "true" : "false"}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">{data?.cortesia ? "Sí" : "No"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminData;
