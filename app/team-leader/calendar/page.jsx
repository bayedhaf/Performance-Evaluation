'use client'
import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import Link from 'next/link'

export default function CalendarPage() {
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        const res = await fetch('https://dummyjson.com/c/d992-dbf8-451d-885b') // Replace with your real API endpoint
        const data = await res.json()
        setEvaluations(Array.isArray(data) ? data : [])
      } catch (err) {
        setEvaluations([])
      }
      setLoading(false)
    }
    fetchEvaluations()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Employee Evaluation Calendar
        </h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {evaluations.map((evalItem) => (
            <div
              key={evalItem.id}
              className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition-all duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-900">{evalItem.name}</h2>
              <p className="text-sm text-gray-500 mb-2">Date: {evalItem.date}</p>
              <p
                className={`mt-2 mb-4 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                  evalItem.score === 'Excellent'
                    ? 'bg-green-100 text-green-700'
                    : evalItem.score === 'Good'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {evalItem.score}
              </p>
              <Link
                href={`https://calendar.google.com/calendar/r/eventedit?text=Evaluation+-+${encodeURIComponent(evalItem.name)}&dates=${evalItem.date.replace(/-/g, '')}T090000Z/${evalItem.date.replace(/-/g, '')}T100000Z`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                Add to Calendar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}