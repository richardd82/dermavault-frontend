import React from "react";
// import useThemeStore from "../store/themeStore";
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
  // const { theme } = useThemeStore();
  const { users, fetchUsers } = useUserStore();
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
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h1 className='text-xl sm:text-2xl font-semibold text-[#1f2937] dark:text-[#e5e7eb]'>
          Usuarios
        </h1>
        <button
          className='bg-[#a78bfa] dark:bg-[#4f46e5] text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm w-full sm:w-auto'
          onClick={() => setShowModal(true)}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className='w-full overflow-x-auto'>
        <table className=' hidden sm:table min-w-[700px] w-full bg-white dark:bg-[#2a2b2f] rounded-lg shadow-md text-sm'>
          <thead className='bg-[#e1e5e9] dark:bg-[#1f2023] text-[#1f2937] dark:text-[#e5e7eb] text-sm'>
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
                  <div className='w-10 h-10 rounded-full bg-[#a78bfa] dark:bg-[#4f46e5] text-white flex items-center justify-center text-xs font-bold '>
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
        {/* Cards solo para mobile */}
        <div className='sm:hidden space-y-4'>
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setIsEditModalOpen(true);
              }}
              className='bg-white dark:bg-[#2a2b2f] p-4 rounded-lg shadow-md cursor-pointer transition hover:shadow-lg hover:opacity-80 transform hover:scale-90'
            >
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 rounded-full bg-[#4f46e5] dark:bg-[#a78bfa] text-white flex items-center justify-center text-sm font-bold'>
                  {getInitials(u.first_name, u.last_name)}
                </div>
                <div>
                  <p className='font-semibold'>{u.username}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {u.email}
                  </p>
                </div>
              </div>
              <div className='text-sm text-gray-700 dark:text-gray-300 space-y-1'>
                <p>
                  <span className='font-medium'>Nombre:</span> {u.first_name}
                </p>
                <p>
                  <span className='font-medium'>Apellidos:</span> {u.last_name}
                </p>
                <p>
                  <span className='font-medium'>Rol:</span> {u.role}
                </p>
              </div>
            </div>
          ))}
        </div>
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
