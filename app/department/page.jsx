'use client'
import { Card } from '@/components/ui/card'

import AdminstractureNavBar from '../employee/shared/admisteratur-navbar/NavbarAdmin'

import {departments} from '@/components/jsonfiletest/Department'

export default function DepartmentList() {

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="bg-[#D9D9D9] w-full h-56 flex flex-col justify-center items-center relative">
        <div className="absolute top-0 left-0 w-full">
          <AdminstractureNavBar />
        </div>
        <h1 className="text-center text-2xl font-semibold text-black mt-16">
          Department List
        </h1>
      </div>

     
      <div className="px-4 mt-6">
        <Card className="p-4 shadow-md rounded-lg bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold">Department Name</th>
                  <th className="px-4 py-2 font-semibold">Head of Department</th>
                  <th className="px-4 py-2 font-semibold">No. of Employees</th>
                  <th className="px-4 py-2 font-semibold">Location</th>
                  <th className="px-4 py-2 font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">View All</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{dept.name}</td>
                    <td className="px-4 py-2">{dept.head}</td>
                    <td className="px-4 py-2">{dept.employees}</td>
                    <td className="px-4 py-2">{dept.location}</td>
                    <td className="px-4 py-2">{dept.email}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          dept.status === 'Active'
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-blue-500 cursor-pointer hover:underline">
                      View
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
