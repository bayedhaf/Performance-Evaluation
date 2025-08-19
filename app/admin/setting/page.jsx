'use client'

import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import { Card } from '@/components/ui/card'

import React, { useEffect, useState } from 'react'

export default function RolesPermissions() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})


  const fetchRoles = async () => {
    try {
      const res = await fetch('https://dummyjson.com/c/d8f4-16a1-4305-8611') 
      if (!res.ok) throw new Error('Failed to fetch roles')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const startEdit = (role) => {
    setEditingId(role.id)
    setEditForm(role)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitEdit = async (id) => {
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error('Failed to update role')
      setEditingId(null)
      fetchRoles()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteRole = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    try {
      const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete role')
      fetchRoles()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-center mt-10 animate-pulse">Loading roles...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
     
      <div className="w-full relative shadow-md">
        <AdminstractureNavBar />
      </div>

    
      <div className="text-center mt-24 mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
          🛡 Roles & Permissions
        </h1>
        <p className="text-indigo-400 mt-2 text-lg">
          Manage roles and permissions for your organization
        </p>
      </div>

    
      <div className="px-6 pb-12">
        <Card className="p-6 shadow-2xl rounded-3xl bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs md:text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Permissions</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-indigo-50 transition duration-300">
                    <td className="px-4 py-3">
                      {editingId === role.id ? (
                        <input
                          type="text"
                          name="role"
                          value={editForm.role}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        role.role
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === role.id ? (
                        <input
                          type="text"
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        role.description
                      )}
                    </td>
                    <td className="px-4 py-3">{role.permissions}</td>
                    <td className="px-4 py-3 flex gap-2">
                      {editingId === role.id ? (
                        <>
                          <button
                            onClick={() => submitEdit(role.id)}
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
                            onClick={() => startEdit(role)}
                            className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRole(role.id)}
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

          {/* Create Role Button */}
          <div className="mt-6 flex justify-end">
            <button className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              + Create Role
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
