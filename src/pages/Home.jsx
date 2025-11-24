import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Users, Package, ShoppingCart, FileText } from "lucide-react";

/**
 * 🏠 Home Page (Dashboard)
 * -----------------------------------------------------
 * ✔ Shows personalized greeting based on authenticated user
 * ✔ Loads global metrics (clients, products, orders, invoices)
 * ✔ Renders chart of orders by client
 */
export default function Home() {
    const { user, loading } = useAuth();

    const [stats, setStats] = useState({
        clients: 0,
        products: 0,
        orders: 0,
        invoices: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading) {
            fetchStats();
        }
    }, [loading]);

    const fetchStats = async () => {
        try {
            const [clientsRes, productsRes, ordersRes, invoicesRes] = await Promise.all([
                api.get("/clientes"),
                api.get("/productos"),
                api.get("/pedidos"),
                api.get("/facturas"),
            ]);

            // Extract data from ApiResponse structure
            const clients = clientsRes.data.data || [];
            const products = productsRes.data.data || [];
            const orders = ordersRes.data.data || [];
            const invoices = invoicesRes.data.data || [];

            // Set counters
            setStats({
                clients: clients.length || 0,
                products: products.length || 0,
                orders: orders.length || 0,
                invoices: invoices.length || 0,
            });

            // Chart: Orders by Client
            const clientOrderStats = clients.map((client) => ({
                name: client.name || "N/A",
                orders: orders.filter(
                    (order) => order.cliente?.id === client.id
                ).length,
            })).filter(stat => stat.orders > 0); // Only show clients with orders

            setChartData(clientOrderStats);
        } catch (error) {
            console.error("❌ Error loading data:", error);
        } finally {
            setFetching(false);
        }
    };

    // ⏳ Pantalla mientras se carga usuario o datos
    if (loading || fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
                <svg
                    className="animate-spin h-10 w-10 text-blue-500 mb-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <p className="text-lg font-medium">Cargando tu panel...</p>
            </div>
        );
    }

    // 🧠 Normalizar nombre y rol
    const displayName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();
    const roleName =
        user?.role === "ROLE_ADMIN"
            ? "Administrador"
            : user?.role === "ROLE_USER"
                ? "Usuario"
                : user?.role || "Invitado";

    const cards = [
        {
            title: "Clients",
            value: stats.clients,
            icon: <Users className="text-blue-600" size={28} />,
            color: "bg-blue-50",
        },
        {
            title: "Products",
            value: stats.products,
            icon: <Package className="text-green-600" size={28} />,
            color: "bg-green-50",
        },
        {
            title: "Orders",
            value: stats.orders,
            icon: <ShoppingCart className="text-yellow-600" size={28} />,
            color: "bg-yellow-50",
        },
        {
            title: "Invoices",
            value: stats.invoices,
            icon: <FileText className="text-purple-600" size={28} />,
            color: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* 🔹 SALUDO */}
            <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        👋 Bienvenido, {displayName || "Usuario"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Rol:{" "}
                        <span className="font-medium text-blue-600">{roleName}</span>
                    </p>
                </div>
            </div>

            {/* 🔹 TARJETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className={`flex items-center justify-between p-5 rounded-xl shadow ${card.color}`}
                    >
                        <div>
                            <h2 className="text-sm text-gray-500 font-medium">
                                {card.title}
                            </h2>
                            <p className="text-2xl font-bold text-gray-800">
                                {card.value}
                            </p>
                        </div>
                        {card.icon}
                    </div>
                ))}
            </div>

            {/* 🔹 CHART: ORDERS BY CLIENT */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Orders by Client
                </h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center">
                        No hay datos disponibles.
                    </p>
                )}
            </div>
        </div>
    );
}
