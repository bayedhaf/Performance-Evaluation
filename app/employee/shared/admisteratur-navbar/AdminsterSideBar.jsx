'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { MdDashboard } from "react-icons/md"
import { GiStairsGoal } from "react-icons/gi"
import { FaPeopleGroup } from "react-icons/fa6"
import { TbReportSearch } from "react-icons/tb"
import { IoSettings, IoPersonAdd } from "react-icons/io5"
import Link from 'next/link'

export default function AdminsterSideBar() {
  const [admin, setAdmin] = useState({ name: 'Admin User', image: '/image/astuLogo.png' })

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch('/api/admin/profile')
        if (res.ok) {
          const data = await res.json()
          setAdmin({
            name: data.user?.fullName || 'Admin User',
            image: data.user?.profileImage || '/image/astuLogo.png'
          })
        } else {
          // Use fallback data if API fails
          setAdmin({ name: 'Admin User', image: '/image/astuLogo.png' })
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error)
        // Use fallback data if API fails
        setAdmin({ name: 'Admin User', image: '/image/astuLogo.png' })
      }
    }
    fetchAdmin()
  }, [])

  return (
    <aside className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col mt-20">
      <div className="text-center border-b py-8 bg-gradient-to-r from-indigo-400 to-indigo-400 text-white shadow-md rounded-tr-3xl">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-2">
            <Image
              src={admin.image}
              alt="Admin Profile"
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
              priority
              sizes="80px"
              onError={(e) => {
                e.target.src = '/image/astuLogo.png'
              }}
            />
          </div>
          <div className="text-lg font-bold tracking-wide mt-2">{admin.name}</div>
          <div className="text-xs font-medium text-indigo-100 mt-1">Administrator</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 py-8 px-4 text-gray-700 flex-1">
        <SidebarLink href="/admin/dashboard" icon={<MdDashboard />} label="Dashboard" />
        <SidebarLink href="/admin/dashboard/newusers" icon={<IoPersonAdd />} label="Register New Employee" />
        <SidebarLink href="/admin/department" icon={<GiStairsGoal />} label="Departments" />
        <SidebarLink href="/admin/employee_list" icon={<FaPeopleGroup />} label="Employees" />
        <SidebarLink href="/report" icon={<TbReportSearch />} label="Reports" />
        <SidebarLink href="/admin/setting" icon={<IoSettings />} label="Settings" />
      </nav>

      <div className="mt-auto mb-6 px-4">
        <div className="bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2 text-xs text-center font-semibold shadow">
          ASTU Employee Portal
        </div>
      </div>
    </aside>
  )
}

function SidebarLink({ href, icon, label }) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-all font-medium text-base">
        <span className="text-2xl">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  )
}