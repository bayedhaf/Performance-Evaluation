import { Card } from '@/components/ui/card'
import React from 'react'
import AdminstractureNavBar from '../shared/admisteratur-navbar/NavbarAdmin'

export default function EmployeeList() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-[#D9D9D9] w-full h-56 flex flex-col justify-center items-center relative">
        <div className="absolute top-0 left-0 w-full">
          <AdminstractureNavBar />
        </div>
        <h1 className="text-center text-2xl font-semibold text-black mt-16">
          Employee Data List
        </h1>
      </div>

    
      <div className="px-4 mt-6">
        <Card className="p-4 shadow-md rounded-lg bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold">Full Name</th>
                  <th className="px-4 py-2 font-semibold">Department</th>
                  <th className="px-4 py-2 font-semibold">Position</th>
                  <th className="px-4 py-2 font-semibold">Job Type</th>
                  <th className="px-4 py-2 font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Phone No</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">View All</th>
                </tr>
              </thead>
              <tbody>
                {EmployeList.map((list)=><tr key={list.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{list.fullName}</td>
                  <td className="px-4 py-2">{list.department}</td>
                  <td className="px-4 py-2">{list.position}</td>
                  <td className="px-4 py-2">{list.jobType}</td>
                  <td className="px-4 py-2">{list.email}</td>
                  <td className="px-4 py-2">{list.phone}</td>
                  <td>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                     {list.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-blue-500 cursor-pointer hover:underline">
                    View
                  </td>
                </tr>)

                }
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
