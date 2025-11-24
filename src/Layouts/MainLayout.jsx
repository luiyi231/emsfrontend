import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

/**
 * MainLayout
 * -----------------------------------------------------
 * ✔ Contenedor principal del panel EMS
 * ✔ Muestra Sidebar + Topbar + Contenido dinámico
 * ✔ Integra AuthContext y ThemeContext
 */
export default function MainLayout() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            className={`flex h-screen ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            {/* 🔹 SIDEBAR */}
            <Sidebar />

            {/* 🔹 CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col">
                {/* 🔹 TOPBAR */}
                <header
                    className={`flex items-center justify-between px-6 py-3 border-b ${
                        theme === "dark" ? "border-gray-700 bg-gray-800" : "bg-white border-gray-200"
                    }`}
                >
                    <div>
                        <h1 className="text-xl font-semibold">
                            {user
                                ? `Hola, ${user.firstname} ${user.lastname || ""} 👋`
                                : "Bienvenido a EMS"}
                        </h1>
                        {user && (
                            <p className="text-sm text-gray-500">
                                {user.role === "ROLE_ADMIN" ? "Administrador" : "Usuario"}
                            </p>
                        )}
                    </div>

                    {/* 🔹 BOTÓN DE TEMA */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                            theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        title="Cambiar tema"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </header>

                {/* 🔹 ÁREA DE CONTENIDO (RUTAS HIJAS) */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
