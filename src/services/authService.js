import api from "../api/axios";

export async function loginUser(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    return data.token;
}

export async function registerUser(credentials) {
    const { data } = await api.post("/auth/register", credentials);
    return data.token;
}
