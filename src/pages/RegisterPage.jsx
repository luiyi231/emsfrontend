import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const validateForm = () => {
        const { firstname, lastname, email, password } = form;
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!firstname || !lastname || !email || !password) {
            Swal.fire("⚠️ Advertencia", "Todos los campos son obligatorios", "warning");
            return false;
        }

        if (!nameRegex.test(firstname)) {
            Swal.fire("⚠️ Advertencia", "El nombre solo puede contener letras y espacios", "warning");
            return false;
        }

        if (!nameRegex.test(lastname)) {
            Swal.fire("⚠️ Advertencia", "El apellido solo puede contener letras y espacios", "warning");
            return false;
        }

        if (!emailRegex.test(email)) {
            Swal.fire("⚠️ Advertencia", "El email debe tener un formato válido", "warning");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // ✅ Llamada al backend para registrar usuario
            const response = await api.post("/auth/register", form);
            const data = response.data;

            // ✅ Guardar token y usuario completo en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            // ✅ Actualizar contexto global (si se usa AuthContext)
            login(data.token, data);

            Swal.fire(
                "✅ Registro exitoso",
                `Bienvenido ${data.firstname} ${data.lastname}`,
                "success"
            );

            navigate("/");
        } catch (err) {
            // Mostrar mensaje de error del backend si existe
            const errorMessage = err.response?.data?.message || "No se pudo completar el registro. Intenta nuevamente.";
            Swal.fire(
                "❌ Error",
                errorMessage,
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
                    Crear cuenta — EMS
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="Nombre"
                        value={form.firstname}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="text"
                        name="lastname"
                        placeholder="Apellido"
                        value={form.lastname}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* Password con ojito 👁️ */}
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
                                Registrando...
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-500">
                    ¿Ya tienes una cuenta?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Iniciar sesión
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
