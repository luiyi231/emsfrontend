import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createDepartment,
    updateDepartment,
    getDepartmentById,
} from "../../services/DepartmentService";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

/**
 * 🏢 DepartmentForm
 * -----------------------------------------------------
 * ✔ Funciona tanto para crear como para editar.
 * ✔ Normaliza campos del backend (department_name / name).
 * ✔ Evita que se guarden valores null o undefined.
 * ✔ Mantiene compatibilidad completa con el backend actual.
 */
export default function DepartmentForm() {
    const [department, setDepartment] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadDepartment();
    }, [id]);

    const loadDepartment = async () => {
        try {
            const res = await getDepartmentById(id);
            const data = res.data?.data || res.data;

            // ✅ Normalizar datos (por compatibilidad con backend)
            setDepartment({
                id: data.id,
                name: data.name || data.department_name || "",
                description: data.description || "",
            });
        } catch (err) {
            console.error("❌ Error al cargar departamento:", err);
            Swal.fire("Error", "Failed to load department", "error");
        }
    };

    const handleChange = (e) =>
        setDepartment({ ...department, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // ✅ Normalizar antes de enviar al backend
        const payload = {
            name: department.name?.trim() || department.department_name?.trim(),
            description: department.description?.trim() || "",
        };

        try {
            if (id) {
                await updateDepartment(id, payload);
                Swal.fire("Updated", "Department updated successfully", "success");
            } else {
                await createDepartment(payload);
                Swal.fire("Created", "Department created successfully", "success");
            }
            navigate("/departments");
        } catch (err) {
            console.error("❌ Error al guardar departamento:", err);
            Swal.fire("Error", "Failed to save department", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {id ? "✏️ Edit Department" : "➕ Add Department"}
                </h1>
                <button
                    onClick={() => navigate("/departments")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    name="name"
                    value={department.name}
                    onChange={handleChange}
                    placeholder="Department Name"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    name="description"
                    value={department.description}
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
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" />
                            Save Department
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
