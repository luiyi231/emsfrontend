import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createSkill,
    updateSkill,
    getSkillById,
} from "../../services/SkillService";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function SkillForm() {
    const [skill, setSkill] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadSkill();
    }, [id]);

    const loadSkill = async () => {
        try {
            const res = await getSkillById(id);
            setSkill(res.data);
        } catch {
            Swal.fire("Error", "Failed to load skill data", "error");
        }
    };

    const handleChange = (e) =>
        setSkill({ ...skill, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateSkill(id, skill);
                Swal.fire("Updated", "Skill updated successfully", "success");
            } else {
                await createSkill(skill);
                Swal.fire("Created", "Skill created successfully", "success");
            }
            navigate("/skills");
        } catch {
            Swal.fire("Error", "Failed to save skill", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {id ? "✏️ Edit Skill" : "➕ Add Skill"}
                </h1>
                <button
                    onClick={() => navigate("/skills")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    name="name"
                    value={skill.name}
                    onChange={handleChange}
                    placeholder="Skill Name"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    name="description"
                    value={skill.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows="3"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} /> Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" /> Save Skill
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
