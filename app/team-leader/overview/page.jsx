'use client'
import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import { Calendar, Users, BarChart3, Award } from 'lucide-react'
import Link from 'next/link'

export default function OverviewPage() {
  const stats = [
    { title: 'Total Employees', value: 45, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { title: 'Evaluations Completed', value: 120, icon: Award, color: 'bg-green-100 text-green-700' },
    { title: 'Upcoming Reviews', value: 8, icon: Calendar, color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Average Score', value: '85%', icon: BarChart3, color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        
      
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
            >
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-xl font-semibold">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

      
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Link
            href="/employee/evaluations"
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border text-center"
          >
            <Award className="mx-auto text-green-500 mb-3" size={40} />
            <h3 className="text-lg font-semibold">View Evaluations</h3>
            <p className="text-sm text-gray-500">Check employee performance records</p>
          </Link>

          <Link
            href="/employee/calendar"
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border text-center"
          >
            <Calendar className="mx-auto text-yellow-500 mb-3" size={40} />
            <h3 className="text-lg font-semibold">Calendar</h3>
            <p className="text-sm text-gray-500">See upcoming review schedules</p>
          </Link>

          <Link
            href="/employee/reports"
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border text-center"
          >
            <BarChart3 className="mx-auto text-purple-500 mb-3" size={40} />
            <h3 className="text-lg font-semibold">Reports</h3>
            <p className="text-sm text-gray-500">Analyze performance trends</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
