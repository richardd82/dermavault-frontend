import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

const Dashboard = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) {
        console.log('⛔ No hay usuario autenticado o token. No se hace la petición.');
        return;
      }

      // console.log('📡 Haciendo petición a:', `${API_URL}/users/${user.id}`);

      try {
        const res = await axios.get(`${API_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // console.log('✅ Respuesta de la API:', res);

        if (res.data?.id === user.id) {
          // console.log('✅ Datos correctos:', res.data);
          setUserData(res.data);
        } else {
          console.log('⛔ El usuario en la API no coincide con el usuario en el estado.');
          setError('Usuario no encontrado o datos no coinciden.');
        }
      } catch (error) {
        console.error('🚨 Error en la petición:', error);
        setError('No se pudo cargar la información del usuario.');
      }
    };

    fetchUserData();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No registrado';

    const fechaObj = new Date(fecha);
    
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',  // Martes
      day: 'numeric',    // 18
      month: 'long',     // Marzo
      year: 'numeric',   // 2025
      hour: '2-digit',   // 01
      minute: '2-digit', // 36
      hour12: true       // Formato 12h (am/pm)
    }).format(fechaObj);
  };
//className="min-h-screen flex flex-col items-center justify-center"
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {`${user?.first_name} ${user?.last_name}`}</h1>

      {error && <p className="text-red-500">{error}</p>}

      {userData ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <p><strong>Usuario:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Rol:</strong> {userData.role}</p>
          <p><strong>Último Login:</strong>{" " + formatFecha(userData.last_login)}</p>
        </div>
      ) : (
        <p className="text-gray-500">Cargando información del usuario...</p>
      )}

      <Button
        className="mt-4 w-1/3" 
        onClick={handleLogout}
      >
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default Dashboard;
