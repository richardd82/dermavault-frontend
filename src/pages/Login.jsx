import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await login(credentials.username, credentials.password);
    if (res.success) {
      navigate('/dashboard'); // Redirige si el login es exitoso
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
        
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input 
            type="text" name="username" placeholder="Usuario"
            value={credentials.username} onChange={handleChange}
            className="w-full p-2 mb-3 border rounded" required
          />
          <input 
            type="password" name="password" placeholder="Contraseña"
            value={credentials.password} onChange={handleChange}
            className="w-full p-2 mb-3 border rounded" required
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
