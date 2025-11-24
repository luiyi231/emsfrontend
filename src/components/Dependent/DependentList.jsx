import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllDependents, deleteDependent } from "../../services/DependentService";
import { Users, Plus, Pencil, Trash2, Phone } from "lucide-react";

export default function DependentList() {
    const [dependents, setDependents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDependents();
    }, []);

    const loadDependents = async () => {
        try {
            const res = await getAllDependents();
            setDependents(res.data);
        } catch {
            Swal.fire("Error", "Failed to load dependents", "error");
        }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: "¿Eliminar dependiente?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        });
        if (res.isConfirmed) {
            try {
                await deleteDependent(id);
                Swal.fire("Eliminado", "Dependiente eliminado con éxito", "success");
                loadDependents();
            } catch {
                Swal.fire("Error", "No se pudo eliminar el dependiente", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">👨‍👩‍👧 Dependents</h1>
                    <p className="text-gray-500 text-sm">
                        Lista de dependientes asociados a empleados.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dependents/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={18} /> Add Dependent
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Relationship</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Employee</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dependents.length ? (
                        dependents.map((d, i) => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                                    <Users size={16} className="text-blue-600" /> {d.name}
                                </td>
                                <td className="p-3 text-gray-600">{d.relationship}</td>
                                <td className="p-3 text-gray-600 flex items-center gap-1">
                                    <Phone size={14} className="text-gray-400" /> {d.phone}
                                </td>
                                <td className="p-3 text-gray-600">
                                    {d.employeeName || "—"}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            to={`/dependents/edit/${d.id}`}
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
                            <td colSpan="6" className="text-center text-gray-500 py-6">
                                No dependents found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
