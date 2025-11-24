import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllSkills, deleteSkill } from "../../services/SkillService";
import { Lightbulb, Plus, Pencil, Trash2 } from "lucide-react";

export default function SkillList() {
    const [skills, setSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const res = await getAllSkills();
            const rawSkills = res.data?.data || res.data || [];
            const normalized = rawSkills.map((d) => ({
                    id: d.id,
                    name: d.name || d.department_name || "Sin nombre",
                    description: d.description || "Sin descripción",
                }));
            setSkills(normalized)
        } catch {
            console.error("❌ Error al cargar skills:", e);
            Swal.fire("Error", "Failed to load skills", "error");
            setSkills([]);
        }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: "¿Eliminar habilidad?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        });
        if (res.isConfirmed) {
            try {
                await deleteSkill(id);
                Swal.fire("Eliminado", "Skill deleted successfully", "success");
                loadSkills();
            } catch {
                Swal.fire("Error", "Failed to delete skill", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🧠 Skills</h1>
                    <p className="text-gray-500 text-sm">Lista de habilidades disponibles.</p>
                </div>
                <button
                    onClick={() => navigate("/skills/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={18} /> Add Skill
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Skill Name</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills.length ? (
                        
                        skills.map((s, i) => (
                            <tr key={s.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                                    <Lightbulb size={16} className="text-yellow-600" /> {s.name}
                                </td>
                                <td className="p-3 text-gray-600">{s.description || "—"}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            to={`/skills/edit/${s.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(s.id)}
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
                                No skills found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
