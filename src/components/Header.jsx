import { useAuth } from "../context/useAuth";

import { LogOut } from "lucide-react";


export default function Header() {
    const { user, logout } = useAuth();


    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
            <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{user?.username || "User"}</span>
                <button
                    onClick={logout}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </header>
    );
}