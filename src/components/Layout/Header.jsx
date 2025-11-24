import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Header — Minimal blue/white style
 * Muestra el título de la app y las rutas principales.
 * Incluye botón de logout (cuando haya autenticación JWT real).
 */

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
            <div className="container-fluid px-4">
                {/* 🔹 Brand / Logo */}
                <Link to="/" className="navbar-brand fw-bold text-primary">
                    Enterprise Management System
                </Link>

                {/* 🔹 Toggle button para móviles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 🔹 Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated && (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/departments">
                                    Departments
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/employees">
                                    Employees
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/skills">
                                    Skills
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dependents">
                                    Dependents
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/employee-skills">
                                    Employee Skills
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-primary ms-3"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
