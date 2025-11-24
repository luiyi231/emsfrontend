import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import ClientPage from "./pages/ClientPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import InvoicePage from "./pages/InvoicePage";

import "./index.css";

/**
 * 🚀 App.jsx — Enrutador principal
 * -----------------------------------------------------
 * ✔ Define rutas públicas (login, register)
 * ✔ Protege el resto con ProtectedRoute
 * ✔ Evita parpadeo infinito al cargar sesión
 */
export default function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* 🔓 RUTAS PÚBLICAS */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* 🔒 RUTAS PROTEGIDAS */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Home />} />
                            <Route path="clients/*" element={<ClientPage />} />
                            <Route path="products/*" element={<ProductPage />} />
                            <Route path="orders/*" element={<OrderPage />} />
                            <Route path="invoices/*" element={<InvoicePage />} />
                        </Route>

                        {/* 🚦 Redirección general */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}
