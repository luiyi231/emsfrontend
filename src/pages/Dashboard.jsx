import React, { useEffect, useState } from "react";
import api from "../api"; // tu archivo api.js

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                Welcome,{" "}
                <span className="text-blue-600">
          {user?.firstname || "User"} {user?.lastname || ""}
        </span>{" "}
                👋
            </h1>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <p>
                    <strong>Email:</strong> {user?.email || "—"}
                </p>
                <p>
                    <strong>Role:</strong>{" "}
                    {user?.role === "ROLE_ADMIN" ? "Administrator" : "User"}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
