'use client'
import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import { Calendar, Users, BarChart3, Award } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function OverviewPage() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('https://dummyjson.com/c/d318-b05e-47fe-aef9') // Replace with your get endpoint
        const data = await res.json()
        setStats(Array.isArray(data) ? data : [])
      } catch (err) {
        setStats([])
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  const iconMap = {
    Users: { icon: Users, href: '/team-leader/teams' },
 
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 bg-gray-200 ">Dashboard Overview</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconObj = iconMap[stat.icon]
            const Icon = IconObj?.icon
          
            const content = (
              <div
                className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {Icon && <Icon size={24} />}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-xl font-semibold">{stat.value}</h2>
                </div>
              </div>
            )
            return IconObj?.href ? (
              <Link key={idx} href={IconObj.href}>
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            )
          })}
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
            href="calendar"
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border text-center"
          >
            <Calendar className="mx-auto text-yellow-500 mb-3" size={40} />
            <h3 className="text-lg font-semibold">Calendar</h3>
            <p className="text-sm text-gray-500">See upcoming review schedules</p>
          </Link>

          <Link
            href="peer-and-self-report"
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