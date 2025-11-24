import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
    baseURL: "http://localhost:9090/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 500 errors caused by invalid JWT tokens FIRST (most common issue)
        if (error.response && error.response.status === 500) {
            const errorMessage = error.response.data?.message || error.message || "";

            // Check if it's a JWT/authentication related error
            if (errorMessage.includes("Usuario no encontrado") ||
                errorMessage.includes("User not found") ||
                errorMessage.includes("JWT") ||
                errorMessage.includes("token")) {

                console.warn("⚠️ Invalid token detected, clearing session immediately...");

                // Clear immediately without waiting
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                delete api.defaults.headers.common["Authorization"];

                // Redirect immediately
                window.location.href = "/login";

                return Promise.reject(error);
            }
        }

        // Handle 401 Unauthorized
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete api.defaults.headers.common["Authorization"];
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
