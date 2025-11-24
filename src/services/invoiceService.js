import api from "./api";

const INVOICES_URL = "/facturas";

export const getAllInvoices = async () => {
    const response = await api.get(INVOICES_URL);
    return response.data.data;
};

export const getInvoiceById = async (id) => {
    const response = await api.get(`${INVOICES_URL}/${id}`);
    return response.data.data;
};

export const createInvoice = async (invoiceData) => {
    const response = await api.post(INVOICES_URL, invoiceData);
    return response.data.data;
};

export const updateInvoice = async (id, invoiceData) => {
    const response = await api.put(`${INVOICES_URL}/${id}`, invoiceData);
    return response.data.data;
};

export const deleteInvoice = async (id) => {
    const response = await api.delete(`${INVOICES_URL}/${id}`);
    return response.data;
};
