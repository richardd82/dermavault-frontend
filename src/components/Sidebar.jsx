import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from './Button';
import { AiOutlineHome } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { BsWindow } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";


const Sidebar = () => {
  const { user, logout } = useAuthStore();
  console.log(user, "EL USUARIO EN SIDEBAR")
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    
    <div className='flex flex-col gap-32 md:gap-52 w-full h-full mt-10 '>
      
      {/* Menú de navegación vertical */}
      <nav className="flex flex-col  mt-5 gap-6 p-4 text-black dark:text-white h-full">
        <Link to="/dashboard" className="p-2 rounded hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5] flex flex-row gap-5 items-center"><AiOutlineHome size={30} /> Inicio</Link>
        <Link to="/patients" className="p-2 rounded hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5] flex flex-row gap-5 items-center"><FiUsers size={30}/> Pacientes</Link>
        <Link to="#" className="p-2 rounded hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5] flex flex-row gap-5 items-center"><BsWindow size={30}/> Fichas Médicas</Link>
        {user?.role === "admin" ? <Link to="/users" className="p-2 rounded hover:bg-[#a78bfa] dark:hover:bg-[#4f46e5] flex flex-row gap-5 items-center"><FaRegUser size={30}/> Usuarios</Link> : null}
      </nav>

      {/* Botón de Logout */}
      <div className="flex-col w-full justify-end h-full p-8 hidden sm:block">
        <Button onClick={handleLogout} className="mt-auto  p-2 rounded">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
