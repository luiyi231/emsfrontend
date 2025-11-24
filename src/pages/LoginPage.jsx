import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/**
 * 🔐 LoginPage
 * -----------------------------------------------------
 * ✔ Envía credenciales al backend (/auth/login)
 * ✔ Guarda token y usuario completo en localStorage
 * ✔ Evita redirecciones erróneas al inicio
 * ✔ Muestra mensaje elegante de bienvenida
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);
            const data = response.data;

            // ✅ Manejar token y datos del usuario
            const token = data.token || data.accessToken;
            if (!token) throw new Error("Token no recibido desde el backend.");

            // Algunos backends devuelven { token, user }, otros devuelven todo junto
            const userData = data.user || data;

            // ✅ Guardar token y datos en el contexto y localStorage
            login(token, userData);

            // ✅ Mensaje de bienvenida
            Swal.fire({
                title: "✅ Bienvenido",
                text: "Autenticación exitosa. Cargando tu panel...",
                icon: "success",
                confirmButtonColor: "#6366F1",
                timer: 1500,
                showConfirmButton: false,
            });

            // ✅ Redirigir tras una breve pausa
            setTimeout(() => navigate("/"), 1600);
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            Swal.fire(
                "❌ Error",
                "Credenciales inválidas o el servidor no está disponible",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    EMS — Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 📨 Correo electrónico */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* 🔑 Contraseña con ojito 👁️ */}
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* 🔘 Botón de iniciar sesión */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                                Iniciando...
                            </>
                        ) : (
                            "Iniciar sesión"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-500">
                    ¿No tienes una cuenta?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigate("/register")}
                    >
            Crear cuenta
          </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
