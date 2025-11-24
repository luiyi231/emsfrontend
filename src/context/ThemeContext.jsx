import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/**
 * Hook personalizado para acceder al tema desde cualquier componente
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider
 * -----------------------------------------------------
 * ✔ Maneja modo claro / oscuro globalmente
 * ✔ Guarda preferencia en localStorage
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    // Cargar tema guardado o preferencia del sistema
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    // Cambiar tema y guardar preferencia
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme === "dark" ? "dark" : ""}>{children}</div>
        </ThemeContext.Provider>
    );
};
