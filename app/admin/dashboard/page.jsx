'use client'

import React from 'react'
import Link from 'next/link'
import { Users, UserPlus, Settings, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center px-6 py-12">
      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-sm">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Quick insights and tools to manage employees effectively.
        </p>
      </div>

      {/* Intro Section */}
      <section className="w-full max-w-6xl bg-white/70 backdrop-blur-md rounded-3xl border border-indigo-100 p-10 shadow-lg mb-12">
        <div className="text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to the <span className="font-semibold text-indigo-700">ASTU Employee Management Portal</span>.  
            Use the tools below to register new employees, manage accounts, and monitor system activity.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1 */}
        <Link
          href="/admin/dashboard/newusers"
          className="group flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg border border-indigo-200 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
            <UserPlus size={32} className="text-indigo-700" />
          </div>
          <h2 className="text-lg font-semibold text-indigo-800 mt-4">Register New User</h2>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Add and onboard employees with ease.
          </p>
        </Link>

        {/* Card 2 */}
        <Link
          href="/admin/dashboard/manage-users"
          className="group flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg border border-green-200 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition">
            <Users size={32} className="text-green-700" />
          </div>
          <h2 className="text-lg font-semibold text-green-800 mt-4">Manage Users</h2>
          <p className="text-gray-600 text-center mt-2 text-sm">
            View, update, or deactivate employee accounts.
          </p>
        </Link>

        {/* Card 3 */}
        <Link
          href="/admin/dashboard/reports"
          className="group flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg border border-yellow-200 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition">
            <BarChart3 size={32} className="text-yellow-700" />
          </div>
          <h2 className="text-lg font-semibold text-yellow-800 mt-4">Reports & Analytics</h2>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Track employee performance and activity stats.
          </p>
        </Link>

        {/* Card 4 */}
        <Link
          href="/admin/dashboard/settings"
          className="group flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition">
            <Settings size={32} className="text-purple-700" />
          </div>
          <h2 className="text-lg font-semibold text-purple-800 mt-4">Settings</h2>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Configure system preferences and roles.
          </p>
        </Link>
      </section>
    </main>
  )
}
