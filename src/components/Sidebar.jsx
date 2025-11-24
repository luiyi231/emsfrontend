import { NavLink } from "react-router-dom";
import { Home, Users, Package, ShoppingCart, FileText, Settings } from "lucide-react";

export default function Sidebar() {
    const links = [
        { to: "/", label: "Dashboard", icon: <Home size={18} /> },
        { to: "/clients", label: "Clients", icon: <Users size={18} /> },
        { to: "/products", label: "Products", icon: <Package size={18} /> },
        { to: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
        { to: "/invoices", label: "Invoices", icon: <FileText size={18} /> },
        { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200">
            <div className="px-6 py-4 text-2xl font-semibold text-gray-800 border-b border-gray-200">
                Sales System
            </div>
            <nav className="p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.icon}
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
