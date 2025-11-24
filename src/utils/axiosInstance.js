import axios from "axios";

const API_BASE_URL = "http://localhost:9090/api";

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token en cada request automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
