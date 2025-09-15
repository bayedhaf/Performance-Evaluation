'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import AdminstractureNavBar from '../employee/shared/admisteratur-navbar/NavbarAdmin'

export default function DepartmentList() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('https://dummyjson.com/c/b2d4-06cf-4b34-88c0')
        const data = await res.json()
        setDepartments(data)
      } catch (err) {
        console.error('Failed to fetch departments', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDepartments()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
     
      <div className="w-full relative shadow-md">
        <AdminstractureNavBar />
      </div>

     
      <div className="text-center mt-24 mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-md">
          📑 Department List
        </h1>
        <p className="text-indigo-400 mt-2 text-lg">
          Manage and monitor all departments
        </p>
      </div>

     
      <div className="px-6 pb-12">
        <Card className="p-6 shadow-2xl rounded-3xl bg-white border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse text-lg">
              Loading departments...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
                <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs md:text-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Department Name</th>
                    <th className="px-4 py-3 font-semibold">Head of Department</th>
                    <th className="px-4 py-3 font-semibold">Employees</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-indigo-50 transition duration-300"
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{dept.name}</td>
                      <td className="px-4 py-3 text-gray-600">{dept.head}</td>
                      <td className="px-4 py-3 text-center">{dept.employees}</td>
                      <td className="px-4 py-3 text-gray-600">{dept.location}</td>
                      <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                        {dept.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            dept.status === 'Active'
                              ? 'text-green-700 bg-green-100'
                              : 'text-red-700 bg-red-100'
                          }`}
                        >
                          {dept.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700 hover:scale-105 transition transform">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
