import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAllEmployees,
  deleteEmployee,
} from "../../services/EmployeeService";
import { UserPlus, Pencil, Trash2, Mail, Building2, Award } from "lucide-react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  /** Load all employees on mount */
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await getAllEmployees();

      const rawEmployees = res.data?.data || res.data || [];

      // ✅ Normalizar campos
      const normalized = rawEmployees.map((e) => ({
        id: e.id,
        firstName: e.firstName || "Sin nombre",
        lastName: e.lastName || "Sin apellido",
        email: e.email || "Sin email",
        address: e.address || "Sin direccion",
        departmentName: e.departmentName || "Sin departamentos",
        skillNames: Array.isArray(e.skillNames) ? e.skillNames : [],
      }));

      //       private Long id;
      // private String firstName;
      // private String lastName;
      // private String email;
      // private String address;
      // private String phone;

      // private String departmentName; // ✅ Nombre del departamento
      // private List<String> skillNames; // ✅ Habilidades del empleado

      setEmployees(normalized);
    } catch (e) {
      console.error("❌ Error al cargar employees:", e);
      Swal.fire("Error", "Failed to load employees", "error");
      setEmployees([]);
    }
  };

  /** Delete confirmation */
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEmployee(id);
          Swal.fire("Eliminado", "Empleado eliminado con éxito.", "success");
          loadEmployees();
        } catch (error) {
          console.error("Error deleting employee:", error);
          Swal.fire("Error", "No se pudo eliminar el empleado", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👥 Employee List</h1>
          <p className="text-gray-500 text-sm">
            Lista de empleados registrados en el sistema EMS.
          </p>
        </div>
        <button
          onClick={() => navigate("/employees/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-left text-gray-700 text-sm uppercase">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Address</th>
              <th className="p-3">Department</th>
              <th className="p-3">Skills</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((e, i) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3 items-center gap-2 text-gray-800 font-semibold">
                    <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                      {e.firstName?.charAt(0).toUpperCase() || "?"}
                    </span>
                    {e.firstName} {e.lastName}
                  </td>

                  <td className="p-3 text-gray-600 items-center gap-1">
                    <Mail size={14} className="text-gray-400" /> 
                    {e.email}
                  </td>
                  
                  <td className="p-3 text-gray-600 items-center gap-1">
                    {e.address}
                  </td>
                  <td className="p-3 text-gray-600 items-center gap-1">
                    <Building2 size={14} className="text-gray-400" />{" "}
                    {e.departmentName || "—"}
                  </td>
                  <td className="p-3 text-gray-600 items-center gap-1">
                    <Award size={14} className="text-gray-400" />{" "}
                    {e.skillNames?.length ? e.skillNames.join(", ") : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/employees/edit/${e.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500 italic"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
