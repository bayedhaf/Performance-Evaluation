'use client'

import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import { Card } from '@/components/ui/card'

import React, { useEffect, useState } from 'react'

export default function RolesPermissions() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Roles are predefined; no editing state needed


  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles')
      if (!res.ok) throw new Error('Failed to fetch roles')
      const data = await res.json()
      setRoles(data.roles || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // Roles are predefined in the system; Settings displays their descriptions and default permissions.

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
                  <th className="px-4 py-3 font-semibold">Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roles.map((r) => (
                  <tr key={r.role} className="hover:bg-indigo-50 transition duration-300">
                    <td className="px-4 py-3">{r.role}</td>
                    <td className="px-4 py-3">{r.description}</td>
                    <td className="px-4 py-3">{Array.isArray(r.permissions) ? r.permissions.join(', ') : r.permissions}</td>
                    <td className="px-4 py-3">{Array.isArray(r.users) ? r.users.length : 0}</td>
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
