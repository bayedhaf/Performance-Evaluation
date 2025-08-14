'use client'
import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import { useState } from 'react'

export default function EmployeeEvaluationBoard() {
  const [evaluations] = useState([
    { id: 1, name: 'Bayisa ', score: 'Excellent', date: '2025-08-10' },
    { id: 2, name: 'Jane Tola', score: 'Good', date: '2025-08-08' },
    { id: 3, name: 'Mimi dagim', score: 'Needs Improvement', date: '2025-08-05' },
  ])

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="p-6 max-w-7xl mx-auto">
    
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Employee Evaluation Board
        </h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {evaluations.map((evalItem) => (
            <div
              key={evalItem.id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {evalItem.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    evalItem.score === 'Excellent'
                      ? 'bg-green-100 text-green-700'
                      : evalItem.score === 'Good'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {evalItem.score}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Date: {evalItem.date}</p>
              <div className="mt-4 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    evalItem.score === 'Excellent'
                      ? 'bg-green-500 w-full'
                      : evalItem.score === 'Good'
                      ? 'bg-blue-500 w-2/3'
                      : 'bg-red-500 w-1/3'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
