import React, { useEffect, useState } from "react";
import { getAllInvoices, createInvoice, deleteInvoice } from "../services/invoiceService";
import { getAllOrders } from "../services/orderService";
import { Plus, Trash, Search } from "lucide-react";
import Swal from "sweetalert2";

export default function InvoicePage() {
    const [invoices, setInvoices] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        pedidoId: "",
        fecha: "",
        total: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invoicesData, ordersData] = await Promise.all([
                getAllInvoices(),
                getAllOrders()
            ]);
            setInvoices(invoicesData || []);
            setOrders(ordersData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire("Error", "Could not load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await deleteInvoice(id);
                setInvoices(invoices.filter(i => i.id !== id));
                Swal.fire("Deleted!", "Invoice has been deleted.", "success");
            } catch (error) {
                Swal.fire("Error", "Could not delete invoice", "error");
            }
        }
    };

    const handleOpenModal = () => {
        setFormData({
            pedidoId: "",
            fecha: new Date().toISOString().split('T')[0],
            total: ""
        });
        setIsModalOpen(true);
    };

    const handleOrderChange = (e) => {
        const orderId = e.target.value;
        const order = orders.find(o => o.id === parseInt(orderId));

        setFormData({
            ...formData,
            pedidoId: orderId,
            total: order ? order.total : ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const invoiceData = {
                pedidoId: parseInt(formData.pedidoId),
                fecha: new Date(formData.fecha),
                total: parseFloat(formData.total)
            };

            await createInvoice(invoiceData);
            Swal.fire("Success", "Invoice created successfully", "success");
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            Swal.fire("Error", "Could not create invoice", "error");
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.id.toString().includes(searchTerm) ||
        invoice.pedido?.id?.toString().includes(searchTerm)
    );

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Invoice
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">Invoice ID</th>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">#{invoice.id}</td>
                                    <td className="p-4 text-gray-600">#{invoice.pedido?.id || "N/A"}</td>
                                    <td className="p-4 text-gray-600">{new Date(invoice.fecha).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-600">${invoice.total}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">New Invoice</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.pedidoId}
                                    onChange={handleOrderChange}
                                >
                                    <option value="">Select an order</option>
                                    {orders.map(order => (
                                        <option key={order.id} value={order.id}>
                                            Order #{order.id} - ${order.total} ({order.cliente?.name || "Unknown"})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.total}
                                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
