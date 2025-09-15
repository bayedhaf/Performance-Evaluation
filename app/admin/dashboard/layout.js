'use client'

import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import ToggleAdminsterSideBar from '@/app/employee/shared/admisteratur-navbar/ToggleAdminsterSideBar'
import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5"

export default function DashboardLayout({ children }) {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 text-gray-900">
      <header className="w-full fixed top-0 z-50 shadow-md bg-white">
        <AdminstractureNavBar />
      </header>

      <div className="flex flex-1 mt-20">
        <aside className="bg-gray-100 min-w-[70px] md:min-w-[220px] border-r border-gray-200 shadow-sm">
          <ToggleAdminsterSideBar />
        </aside>

        <main className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 overflow-y-auto bg-gray-50 rounded-tl-3xl">
        
           <section className="w-full max-w-5xl mx-auto">
           <div className=" flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center w-full max-w-md bg-white rounded-full shadow border border-gray-300 px-4 py-2">
              <IoSearch className="text-2xl text-indigo-500 mr-2" />
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Employee"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
         </div>
            {children}
          </section>
        </main>
      </div>
    </div>
  )
}