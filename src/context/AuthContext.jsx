import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * 🧠 AuthContext
 * -----------------------------------------------------
 * ✔ Maneja autenticación global del usuario
 * ✔ Guarda token en localStorage
 * ✔ Carga perfil actual (/auth/me si existe)
 * ✔ Evita bucles infinitos y re-renderizados innecesarios
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    /**
     * 🔄 Al montar el contexto, intenta restaurar sesión
     */
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                // 🔑 Configurar encabezado Authorization global
                api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

                // 🧩 Si ya hay user en localStorage, úsalo directamente
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                    setLoading(false);
                    return;
                }

                // 🚀 Si existe endpoint /auth/me, obtener perfil actualizado
                const res = await api.get("/auth/me");
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
                setToken(storedToken);
            } catch (err) {
                console.warn("⚠️ Sesión inválida o expirada:", err);
                logout(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    /**
     * 🟢 Login: guarda token y usuario en memoria y localStorage
     */
    const login = (newToken, userData = null) => {
        try {
            localStorage.setItem("token", newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            setToken(newToken);

            if (userData) {
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            }
        } catch (err) {
            console.error("Error al guardar sesión:", err);
        }
    };

    /**
     * 🔴 Logout: limpia sesión y redirige al login
     */
    const logout = (redirect = true) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        setToken(null);

        if (redirect) window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token && !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * 🧩 Hook para acceder al contexto desde cualquier componente
 */
export const useAuth = () => useContext(AuthContext);
