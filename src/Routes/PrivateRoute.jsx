// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * 🔒 PrivateRoute
 * -----------------------------------------------------
 * Espera a que AuthContext termine de cargar (loading=false)
 * Si hay usuario => renderiza children
 * Si no hay usuario => redirige al login
 */
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    // 🔹 Mientras se verifica sesión
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
                <svg
                    className="animate-spin h-10 w-10 text-blue-500 mb-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <p className="text-lg font-medium">Verificando sesión...</p>
            </div>
        );
    }

    // 🔹 Cuando ya terminó de cargar
    return user ? children : <Navigate to="/login" replace />;
}
