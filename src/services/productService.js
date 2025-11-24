import api from "./api";

const PRODUCTS_URL = "/productos";

export const getAllProducts = async () => {
    const response = await api.get(PRODUCTS_URL);
    return response.data.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`${PRODUCTS_URL}/${id}`);
    return response.data.data;
};

export const createProduct = async (productData) => {
    const response = await api.post(PRODUCTS_URL, productData);
    return response.data.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`${PRODUCTS_URL}/${id}`, productData);
    return response.data.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`${PRODUCTS_URL}/${id}`);
    return response.data;
};
