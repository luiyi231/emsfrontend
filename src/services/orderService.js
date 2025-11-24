import api from "./api";

const ORDERS_URL = "/pedidos";

export const getAllOrders = async () => {
    const response = await api.get(ORDERS_URL);
    return response.data.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`${ORDERS_URL}/${id}`);
    return response.data.data;
};

export const createOrder = async (orderData) => {
    const response = await api.post(ORDERS_URL, orderData);
    return response.data.data;
};

export const updateOrder = async (id, orderData) => {
    const response = await api.put(`${ORDERS_URL}/${id}`, orderData);
    return response.data.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(`${ORDERS_URL}/${id}`);
    return response.data;
};
