import React from "react";
import useThemeStore from "../store/themeStore";
import useUserStore from "../store/userStore";
import { FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";
import Modal from "../components/Modal";
import AddUserForm from "../components/AddUserForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import EditUserForm from "../components/EditUserForm";

const getInitials = (first, last) => {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
};

const Users = () => {
  const { theme } = useThemeStore();
  const { users, fetchUsers, loading, error } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  console.log(users, "LOS USUARIOS EN USERS");
  return (
    <div className='p-4 md:p-6 w-full'>
      {/* Header de sección */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <h1 className='text-2xl font-semibold text-[#1f2937] dark:text-[#e5e7eb]'>
          Usuarios
        </h1>
        <button
          className='bg-[#4f46e5] dark:bg-[#a78bfa] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium'
          onClick={() => setShowModal(true)}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white dark:bg-[#2a2b2f] rounded-lg shadow-md'>
          <thead className='bg-[#f8f9fa] dark:bg-[#1f2023] text-[#1f2937] dark:text-[#e5e7eb] text-sm'>
            <tr>
              <th className='p-3 text-left'>Usuario</th>
              <th className='p-3 text-left'>Contraseña</th>
              <th className='p-3 text-left'>Email</th>
              <th className='p-3 text-left'>Nombre(s)</th>
              <th className='p-3 text-left'>Apellidos</th>
              <th className='p-3 text-left'>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr
                key={index}
                onClick={() => {
                  setSelectedUser(u);
                  setIsEditModalOpen(true);
                }}
                className='cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-[#f3f4f6] dark:hover:bg-[#1f2023] transition'
              >
                <td className='p-3 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-[#4f46e5] dark:bg-[#a78bfa] text-white flex items-center justify-center text-xs font-bold'>
                    {getInitials(u.first_name, u.last_name)}
                  </div>
                  <span>{u.username}</span>
                </td>
                <td className='p-3'>●●●●●●●●●</td>
                <td className='p-3'>{u.email}</td>
                <td className='p-3'>{u.first_name}</td>
                <td className='p-3'>{u.last_name}</td>
                <td className='p-3'>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title='Editar usuario'
        >
          <EditUserForm
            user={selectedUser}
            onClose={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Agregar nuevo usuario'
      >
        <AddUserForm onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};

export default Users;
