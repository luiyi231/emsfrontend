import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, createOrder, deleteOrder } from "../services/orderService";
import { getAllClients } from "../services/clientService";
import { getAllProducts } from "../services/productService";
import { Plus, Trash, Search, Eye } from "lucide-react";
import Swal from "sweetalert2";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersData, clientsData, productsData] = await Promise.all([
                getAllOrders(),
                getAllClients(),
                getAllProducts()
            ]);
            setOrders(ordersData || []);
            console.log("Orders Data:", ordersData); // DEBUG: Check client names
            setClients(clientsData || []);
            setProducts(productsData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire("Error", "Could not load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        if (!selectedProduct || quantity <= 0) return;

        if (quantity > 999) {
            Swal.fire("Warning", "You cannot add more than 999 units of a product.", "warning");
            return;
        }

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        const newItem = {
            productoId: product.id,
            name: product.name,
            price: product.price,
            cantidad: parseInt(quantity)
        };

        setOrderItems([...orderItems, newItem]);
        setTotal(total + (product.price * parseInt(quantity)));
        setSelectedProduct("");
        setQuantity(1);
    };

    const handleRemoveItem = (index) => {
        const item = orderItems[index];
        setTotal(total - (item.price * item.cantidad));
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const navigate = useNavigate();

    // ... (existing code)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient || orderItems.length === 0) {
            Swal.fire("Warning", "Please select a client and add at least one product", "warning");
            return;
        }

        const orderData = {
            clienteId: parseInt(selectedClient),
            fecha: new Date(),
            total: total,
            productos: orderItems.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad
            }))
        };

        try {
            const newOrder = await createOrder(orderData);

            const result = await Swal.fire({
                title: "Success",
                text: "Order created successfully! Do you want to generate an invoice now?",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, create invoice",
                cancelButtonText: "No, later"
            });

            setIsModalOpen(false);
            resetForm();
            fetchData();

            if (result.isConfirmed) {
                navigate("/invoices", { state: { prefillOrder: newOrder } });
            }

        } catch (error) {
            console.error("Error creating order:", error);
            let errorMessage = error.response?.data?.message || "Could not create order";

            if (error.response?.data?.data && typeof error.response.data.data === 'object') {
                const fieldErrors = Object.values(error.response.data.data).join("\n");
                if (fieldErrors) {
                    errorMessage += ":\n" + fieldErrors;
                }
            }

            Swal.fire("Error", errorMessage, "error");
        }
    };

    const resetForm = () => {
        setSelectedClient("");
        setOrderItems([]);
        setTotal(0);
        setSelectedProduct("");
        setQuantity(1);
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
                await deleteOrder(id);
                setOrders(orders.filter(o => o.id !== id));
                Swal.fire("Deleted!", "Order has been deleted.", "success");
            } catch (error) {
                Swal.fire("Error", "Could not delete order", "error");
            }
        }
    };

    const filteredOrders = orders.filter(order =>
        order.clienteNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Order
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
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
                                <th className="p-4">ID</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">#{order.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{order.clienteNombre || "Unknown"}</td>
                                    <td className="p-4 text-gray-600">{new Date(order.fecha).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-600">${order.total}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No orders found.
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
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">New Order</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="border-t border-b border-gray-100 py-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Products</h3>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Product</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                        >
                                            <option value="">Select product</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - ${product.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-gray-500 mb-1">Qty</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h3>
                                {orderItems.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-2">No items added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {orderItems.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                                <div className="text-sm">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium">${item.price * item.cantidad}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                                    <span className="font-bold text-gray-700">Total:</span>
                                    <span className="font-bold text-xl text-blue-600">${total}</span>
                                </div>
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
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
