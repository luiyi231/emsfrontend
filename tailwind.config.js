/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1E40AF",     // azul fuerte para botones y headers
                secondary: "#3B82F6",   // azul más claro para acentos
            },
        },
    },
    plugins: [],
};
