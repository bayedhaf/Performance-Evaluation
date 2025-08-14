'use client'

import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import { useState } from 'react'

export default function SingleTeam() {
  const [team] = useState({
    id: 1,
    name: 'Software Development',
    members: [
      {
        name: 'Ali  bon',
        email: 'alice.johnson@example.com',
        phone: '+1 (555) 123-4567',
        status: 'Active',
      },
      {
        name: 'Ezana Bona',
        email: 'ethan.brown@example.com',
        phone: '+1 (555) 234-5678',
        status: 'Inactive',
      },
      {
        name: 'Sophia slon',
        email: 'sophia.wilson@example.com',
        phone: '+1 (555) 345-6789',
        status: 'Active',
      },
    ],
  })

  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="w-full min-h-screen mb-20 flex flex-col bg-gray-50">
      <AdminNavbar />
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Team: {team.name}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Members</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-700 border-collapse block sm:table">
              <thead className="border-b border-gray-300 bg-gray-100 hidden sm:table-header-group">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {team.members.map((member, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition block sm:table-row mb-4 sm:mb-0"
                  >
                    <td className="px-4 py-3 block sm:table-cell font-semibold" data-label="Name">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 block sm:table-cell" data-label="Email">
                      {member.email}
                    </td>
                    <td className="px-4 py-3 block sm:table-cell" data-label="Phone">
                      {member.phone}
                    </td>
                    <td className="px-4 py-3 block sm:table-cell" data-label="Status">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[member.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
