import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div >
      {/* Avatar y nombre del usuario */}
      <div >
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold">{user?.username[0].toUpperCase()}</span>
        </div>
        <div>
          <p className="text-lg font-semibold">{user?.username}</p>
          <p className="text-sm text-gray-400">{user?.role}</p>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="">
        <Link to="/dashboard" className="p-2 rounded hover:bg-gray-700">🏠 Dashboard</Link>
        <Link to="/patients" className="p-2 rounded hover:bg-gray-700">👨‍⚕️ Pacientes</Link>
        <Link to="/users" className="p-2 rounded hover:bg-gray-700">👥 Usuarios</Link>
      </nav>

      {/* Botón de Logout */}
      <button onClick={handleLogout} className="mt-auto p-2 bg-red-600 hover:bg-red-700 rounded">
        🚪 Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
