import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createEmployeeSkill,
    updateEmployeeSkill,
    getEmployeeSkillById,
} from "../../services/EmployeeSkillService";
import { getAllEmployees } from "../../services/EmployeeService";
import { getAllSkills } from "../../services/SkillService";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function EmployeeSkillForm() {
    const [relation, setRelation] = useState({
        employeeId: "",
        skillId: "",
        proficiency: "",
    });
    const [employees, setEmployees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadEmployees();
        loadSkills();
        if (id) loadRelation();
    }, [id]);

    const loadEmployees = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res.data);
        } catch {
            Swal.fire("Error", "Failed to load employees", "error");
        }
    };

    const loadSkills = async () => {
        try {
            const res = await getAllSkills();
            setSkills(res.data);
        } catch {
            Swal.fire("Error", "Failed to load skills", "error");
        }
    };

    const loadRelation = async () => {
        try {
            const res = await getEmployeeSkillById(id);
            setRelation(res.data);
        } catch {
            Swal.fire("Error", "Failed to load employee-skill relation", "error");
        }
    };

    const handleChange = (e) =>
        setRelation({ ...relation, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateEmployeeSkill(id, relation);
                Swal.fire("Updated", "Relation updated successfully", "success");
            } else {
                await createEmployeeSkill(relation);
                Swal.fire("Created", "Relation created successfully", "success");
            }
            navigate("/employee-skills");
        } catch {
            Swal.fire("Error", "Failed to save relation", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {id ? "✏️ Edit Employee Skill" : "➕ Add Employee Skill"}
                </h1>
                <button
                    onClick={() => navigate("/employee-skills")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <select
                    name="employeeId"
                    value={relation.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Employee</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </select>

                <select
                    name="skillId"
                    value={relation.skillId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Skill</option>
                    {skills.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="proficiency"
                    value={relation.proficiency}
                    onChange={handleChange}
                    placeholder="Proficiency Level (e.g. Beginner, Intermediate, Expert)"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

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
                            <Save size={18} className="mr-2" /> Save Relation
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
