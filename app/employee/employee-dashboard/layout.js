import React from 'react'
import Navbar from '../shared/navbar/Navbar'
import TogleSideBar from '../shared/navbar/sidebar/TogleSideBar'


export default function EmployeeLayout({ children }) {
  return (
    <div className="bg-zinc-100 min-h-screen flex flex-col">

      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

   
      <div className="flex flex-row pt-16">
  
        <aside className="mt-16 w-auto md:w-64">
          <TogleSideBar />
        </aside>

     
        <main className="flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
