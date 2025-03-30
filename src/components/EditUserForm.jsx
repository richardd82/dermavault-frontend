import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import toast from "react-hot-toast";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doctor" },
  { value: "assistant", label: "Assistant" },
];

const EditUserForm = ({ user, onClose }) => {
  console.log(user);
  const { updateUser } = useUserStore();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        password: "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.role || "assistant",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateUser(user.id, form);
    if (res.success) {
      toast.success("Los cambios se guardaron correctamente", {
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
      alert("Error al actualizar: " + res.message);
    }
  };
  if (!form) return null;
  // mismo formulario que AddUserForm, solo cambia el botón final
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {[
        { name: "username", label: "Usuario" },
        { name: "password", label: "Contraseña", type: "password" },
        { name: "email", label: "Email", type: "email" },
        { name: "first_name", label: "Nombre(s)" },
        { name: "last_name", label: "Apellidos" },
      ].map(({ name, label, type = "text" }) => (
        <div key={name}>
          <label className='block text-sm font-medium mb-1'>{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2023] text-sm'            
          />
          {errors[name] && (
            <p className='text-red-500 text-sm'>{errors[name]}</p>
          )}
        </div>
      ))}

      {/* Dropdown de rol */}
      <div>
        <label className='block text-sm font-medium mb-1'>Rol</label>
        <select
          name='role'
          value={form.role}
          onChange={handleChange}
          className='w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f2023] text-sm'
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      {/* Botones de acción */}
      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 rounded-md border border-gray-300 text-sm'
        >
          Cancelar
        </button>
        <button
          type='submit'
          className='px-4 py-2 rounded-md bg-[#4f46e5] text-white text-sm hover:opacity-90 transition'
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
