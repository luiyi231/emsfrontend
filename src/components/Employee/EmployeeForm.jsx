import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
  getAllDepartments,
  getAllSkills,
} from "../../services/EmployeeService";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    departmentId: "",
  });

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
    loadSkills();
    if (id) loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const res = await getEmployeeById(id);
      const data = res.data?.data || res.data;
      setEmployee({
        id: data.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        address: data.address || "",
        phone: data.phone || "",
        departmentId: data.departmentId || "",
      });
    } catch (error) {
      console.error("Error loading employee:", error);
      Swal.fire("Error", "Failed to load employee data", "error");
    }
  };

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

  const loadSkills = async () => {
    try {
      const res = await getAllSkills();
      const rawSkills = res.data?.data || res.data || [];
      const normalized = rawSkills.map((d) => ({
        id: d.id,
        name: d.name || d.department_name || "Sin nombre",
        description: d.description || "Sin descripción",
      }));
      setSkills(normalized);
    } catch {
      console.error("❌ Error al cargar skills:", e);
      Swal.fire("Error", "Failed to load skills", "error");
      setSkills([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...employee,
      departmentId: Number(employee.departmentId),
      skillIds: selectedSkills.map((id) => Number(id)),
    };

    try {
      if (id) {
        await updateEmployee(id, payload);
        Swal.fire("✅ Updated", "Employee updated successfully", "success");
      } else {
        await createEmployee(payload);
        Swal.fire("✅ Created", "Employee created successfully", "success");
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire("❌ Error", "Failed to save employee", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? "✏️ Edit Employee" : "➕ Add Employee"}
        </h1>
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          value={employee.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department */}
        <select
          name="departmentId"
          value={employee.departmentId}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSkillToggle(skill.id)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  selectedSkills.includes(skill.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
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
              Save Employee
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
