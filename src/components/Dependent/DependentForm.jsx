import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createDependent,
    updateDependent,
    getDependentById,
} from "../../services/DependentService";
import { getAllEmployees } from "../../services/EmployeeService";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function DependentForm() {
    const [dependent, setDependent] = useState({
        name: "",
        relationship: "",
        phone: "",
        employeeId: "",
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadEmployees();
        if (id) loadDependent();
    }, [id]);

    const loadEmployees = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res.data);
        } catch {
            Swal.fire("Error", "Failed to load employees", "error");
        }
    };

    const loadDependent = async () => {
        try {
            const res = await getDependentById(id);
            setDependent(res.data);
        } catch {
            Swal.fire("Error", "Failed to load dependent", "error");
        }
    };

    const handleChange = (e) =>
        setDependent({ ...dependent, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateDependent(id, dependent);
                Swal.fire("Updated", "Dependent updated successfully", "success");
            } else {
                await createDependent(dependent);
                Swal.fire("Created", "Dependent created successfully", "success");
            }
            navigate("/dependents");
        } catch {
            Swal.fire("Error", "Failed to save dependent", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {id ? "✏️ Edit Dependent" : "➕ Add Dependent"}
                </h1>
                <button
                    onClick={() => navigate("/dependents")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    name="name"
                    value={dependent.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="text"
                    name="relationship"
                    value={dependent.relationship}
                    onChange={handleChange}
                    placeholder="Relationship (e.g. Son, Wife)"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="text"
                    name="phone"
                    value={dependent.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <select
                    name="employeeId"
                    value={dependent.employeeId}
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
                            <Save size={18} className="mr-2" /> Save Dependent
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
