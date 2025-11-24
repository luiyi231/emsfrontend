import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * 🔐 ProtectedRoute
 * -----------------------------------------------------
 * ✔ Espera a que AuthContext termine de cargar
 * ✔ Evita bucles infinitos de redirección
 * ✔ Si hay usuario autenticado → muestra children
 * ✔ Si no hay usuario → redirige a /login
 */
export default function ProtectedRoute({ children }) {
    const { user, loading, token } = useAuth();

    // 🕓 Mostrar pantalla temporal mientras se verifica sesión
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-600">
                <div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full mb-3"></div>
                <p className="text-lg font-medium">Verificando sesión...</p>
            </div>
        );
    }

    // 🚫 Si no hay token ni usuario, redirige al login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Si está autenticado, renderiza el contenido
    return children;
}
