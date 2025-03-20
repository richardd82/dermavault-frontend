import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    //hide error after 5 seconds
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);
    }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(credentials.username, credentials.password);
    if (res.success) {
      navigate("/dashboard"); // Redirige si el login es exitoso
    } else {
      setError(res.message);
    }
  };

  return (
    <div className='flex h-screen bg-gray-900'>
      <div className='w-1/2'></div>
      <div className='w-1/2 bg-blue-200 flex items-center justify-center '>
        <div className='w-1/2 text-center'>
            {error && <p className='text-red-500 text-center text-lg font-bold'>{error}</p>}
          <div className='flex flex-col items-center justify-between p-12 bg-gray-200 shadow-2xl rounded-xl h-96'>
            <h2 className='text-5xl text-gray-900 text-center'>
              Inicia Sesión
            </h2>

            <form
              onSubmit={handleSubmit}
              className='flex flex-col gap-7 w-full justify-center items-center'
            >
              <Input
                type='text'
                name='username'
                placeholder='Usuario'
                value={credentials.username}
                onChange={handleChange}
                className='w-full p-2 mb-3 border rounded'
                required
              />
              <Input
                type='password'
                name='password'
                placeholder='Contraseña'
                value={credentials.password}
                onChange={handleChange}
                className='w-full p-2 mb-3 border rounded'
                required
              />
              <Button type='submit' className='w-3/6 justify-center'>
                {" "}
                Ingresar{" "}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
