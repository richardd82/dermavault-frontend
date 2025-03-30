import React, { useState } from "react";
import useUserStore from "../store/userStore";
import toast from "react-hot-toast";


const roles = ["Admin", "Doctor", "Assistant"];

const AddUserForm = ({ onClose }) => {
  const { addUser } = useUserStore();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "Admin",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    for (const field in form) {
      if (!form[field]) newErrors[field] = "Este campo es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await addUser(form);
    setSubmitting(false);

    if (res.success) {
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
    } else {
      alert("Error al guardar el usuario: " + res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { name: "username", label: "Usuario" },
        { name: "password", label: "Contraseña", type: "password" },
        { name: "email", label: "Email", type: "email" },
        { name: "first_name", label: "Nombre(s)" },
        { name: "last_name", label: "Apellidos" },
      ].map(({ name, label, type = "text" }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2023] text-sm"
            required
          />
          {errors[name] && (
            <p className="text-red-500 text-sm">{errors[name]}</p>
          )}
        </div>
      ))}

      {/* Dropdown de rol */}
      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2023] text-sm"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-[#4f46e5] text-white text-sm hover:opacity-90 transition"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
