import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllEmployeeSkills, deleteEmployeeSkill } from "../../services/EmployeeSkillService";
import { Link as LinkIcon, Plus, Pencil, Trash2 } from "lucide-react";

export default function EmployeeSkillList() {
    const [relations, setRelations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadRelations();
    }, []);

    
    const loadRelations = async () => {
        try {
            const res = await getAllEmployeeSkills();
            setRelations(res.data);
        } catch {
            Swal.fire("Error", "Failed to load employee-skill relations", "error");
        }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: "¿Eliminar relación?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            confirmButtonColor: "#d33",
        });
        if (res.isConfirmed) {
            try {
                await deleteEmployeeSkill(id);
                Swal.fire("Eliminado", "Relación eliminada correctamente", "success");
                loadRelations();
            } catch {
                Swal.fire("Error", "No se pudo eliminar la relación", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🔗 Employee Skills</h1>
                    <p className="text-gray-500 text-sm">
                        Relaciones entre empleados y habilidades.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/employee-skills/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={18} /> Add Relation
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Employee</th>
                        <th className="p-3 text-left">Skill</th>
                        <th className="p-3 text-left">Proficiency</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {relations.length ? (
                        relations.map((r, i) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 text-gray-800 font-semibold">
                                    {r.employeeName || "—"}
                                </td>
                                <td className="p-3 text-gray-700">{r.skillName || "—"}</td>
                                <td className="p-3 text-gray-600">{r.proficiency || "—"}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            to={`/employee-skills/edit/${r.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(r.id)}
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
                            <td colSpan="5" className="text-center text-gray-500 py-6">
                                No employee-skill relations found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
