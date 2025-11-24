import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllDepartments,
    deleteDepartment,
} from "../../services/DepartmentService";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";

/**
 * 🏢 DepartmentList
 * -----------------------------------------------------
 * ✔ Muestra lista de departamentos correctamente, sin depender del backend.
 * ✔ Corrige campos (name / department_name / description nula).
 * ✔ Mantiene la estructura original.
 */
export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const res = await getAllDepartments();

            // ⚙️ Compatibilidad con ApiResponse del backend
            const rawDepartments = res.data?.data || res.data || [];

            // ✅ Normalizar campos
            const normalized = rawDepartments.map((d) => ({
                id: d.id,
                name: d.name || d.department_name || "Sin nombre",
                description: d.description || "Sin descripción",
            }));

            setDepartments(normalized);
        } catch (e) {
            console.error("❌ Error al cargar departamentos:", e);
            Swal.fire("Error", "Failed to load departments", "error");
            setDepartments([]);
        }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: "¿Eliminar departamento?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        });

        if (res.isConfirmed) {
            try {
                await deleteDepartment(id);
                Swal.fire(
                    "Eliminado",
                    "Departamento eliminado correctamente.",
                    "success"
                );
                loadDepartments();
            } catch {
                Swal.fire("Error", "No se pudo eliminar el departamento", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* 🔹 Encabezado */}
            <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🏢 Departments</h1>
                    <p className="text-gray-500 text-sm">
                        Gestión de departamentos del sistema EMS.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/departments/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={18} />
                    Add Department
                </button>
            </div>

            {/* 🔹 Tabla */}
            <div className="bg-white shadow-md rounded-xl p-4">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Department Name</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {departments.length ? (
                        departments.map((d, i) => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                                    <Building2 size={16} className="text-blue-600" />
                                    {d.name}
                                </td>
                                <td className="p-3 text-gray-600">{d.description}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            to={`/departments/edit/${d.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-500 py-6">
                                No departments found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
