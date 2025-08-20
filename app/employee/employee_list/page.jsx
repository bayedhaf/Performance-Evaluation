'use client'

import { Card } from '@/components/ui/card'
import AdminstractureNavBar from '../shared/admisteratur-navbar/NavbarAdmin'
import React, { useEffect, useState } from 'react'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmployees(data.users || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: currentStatus === 'Active' ? false : true }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete employee');
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (employee) => {
    setEditingId(employee._id || employee.id);
    setEditForm({
      fullName: employee.fullName || `${employee.firstName} ${employee.lastName}`,
      department: employee.department?.name || employee.department || '',
      position: employee.position || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update employee');
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 animate-pulse">Loading employees...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
    
      <div className="w-full relative shadow-md">
        <AdminstractureNavBar />
      </div>

   
      <div className="text-center mt-24 mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
          👥 Employee List
        </h1>
        <p className="text-indigo-400 mt-2 text-lg">
          Manage, edit, or deactivate employees
        </p>
      </div>

     
      <div className="px-6 pb-12">
        <Card className="p-6 shadow-2xl rounded-3xl bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs md:text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Full Name</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Position</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp._id || emp.id} className="hover:bg-indigo-50 transition duration-300">
                    <td className="px-4 py-3">
                      {editingId === (emp._id || emp.id) ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        emp.fullName || `${emp.firstName} ${emp.lastName}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === (emp._id || emp.id) ? (
                        <input
                          type="text"
                          name="department"
                          value={editForm.department}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        emp.department?.name || emp.department || 'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === (emp._id || emp.id) ? (
                        <input
                          type="text"
                          name="position"
                          value={editForm.position}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        emp.position || 'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                      {emp.email}
                    </td>
                    <td className="px-4 py-3">{emp.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer shadow-sm ${
                          emp.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                        onClick={() => toggleStatus(emp._id || emp.id, emp.isActive ? 'Active' : 'Inactive')}
                      >
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {editingId === (emp._id || emp.id) ? (
                        <>
                          <button
                            onClick={() => submitEdit(emp._id || emp.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(emp)}
                            className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEmployee(emp._id || emp.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
