import { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
// import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function MainLayout() {
  const { user } = useAuthStore();
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Sidebar (Menú lateral) */}

      <nav>
        <div className='flex items-center space-x-4'>
          <span className='text-gray-700 dark:text-gray-300 font-medium'>
            {user?.username}
          </span>
        </div>
        <Sidebar />
      </nav>

      {/* Outlet donde se carga la página actual */}
      <main>
        <ThemeToggle /> {/* 🔥 Botón para cambiar el tema */}
        <Outlet />
      </main>
    </div>
  );
}
