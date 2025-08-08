

import React from 'react'
import AdminNavbar from '@/app/employee/shared/admin-navbar/AdminNavbar'
import TogleAdminSideBar from '@/app/employee/shared/admin-navbar/TogleAdminSideBar';


export const metadata = {
  title: {
    default: 'ASTU Staff Performance Evaluator',
    absolute: 'ASTU Staff Evaluation',
  },
  description: "Formed by ASTU Civil and Service",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
    
      <div className="sticky top-0 z-50 shadow">
        <AdminNavbar />
      </div>

     
      <div className="flex flex-1">
    
        <TogleAdminSideBar />

      
        <main className="flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
