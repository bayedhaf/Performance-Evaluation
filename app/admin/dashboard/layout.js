'use client'

import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import ToggleAdminsterSideBar from '@/app/employee/shared/admisteratur-navbar/ToggleAdminsterSideBar'
import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5"

export default function DashboardLayout({ children, complain, report, newuser }) {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
    
      <header className="w-full fixed top-0 z-50 shadow-md bg-white">
        <AdminstractureNavBar />
      </header>

      
      <div className="flex flex-1 mt-20">
   
        <aside className="  bg-gray-100  ">
          <ToggleAdminsterSideBar />
        </aside>

    
        <main className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 overflow-y-auto bg-gray-50">
         
          <div className="mb-8 flex items-center gap-3">
            <IoSearch className="text-xl text-gray-600" />
            <label htmlFor="search" className="sr-only">Search Tasks</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks"
              className="w-full max-w-md p-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>


          <div>
           
            {children}


            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 mt-6">
              <div className="flex flex-col justify-around items-center gap-6 w-full sm:w-auto">
                {report && <div className="w-full sm:w-auto">{report}</div>}
                {complain && <div className="w-full sm:w-auto">{complain}</div>}
              </div>
              {newuser && <div className="w-full sm:w-auto">{newuser}</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}