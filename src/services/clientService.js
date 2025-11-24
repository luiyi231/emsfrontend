import api from "./api";

const CLIENTS_URL = "/clientes";

export const getAllClients = async () => {
    const response = await api.get(CLIENTS_URL);
    return response.data.data;
};

export const getClientById = async (id) => {
    const response = await api.get(`${CLIENTS_URL}/${id}`);
    return response.data.data;
};

export const createClient = async (clientData) => {
    const response = await api.post(CLIENTS_URL, clientData);
    return response.data.data;
};

export const updateClient = async (id, clientData) => {
    const response = await api.put(`${CLIENTS_URL}/${id}`, clientData);
    return response.data.data;
};

export const deleteClient = async (id) => {
    const response = await api.delete(`${CLIENTS_URL}/${id}`);
    return response.data;
};
