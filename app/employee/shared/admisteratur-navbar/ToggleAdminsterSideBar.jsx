'use client'

import React, { useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { MdCancel } from "react-icons/md"


import AdminsterSideBar from './AdminsterSideBar'

export default function ToggleAdminsterSideBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
   
      <div className="md:hidden px-4 py-2 flex justify-start">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
          {menuOpen ? <MdCancel /> : <IoMdMenu />}
        </button>
      </div>

      <div className="flex flex-1">
       
        <div className="hidden md:block w-64">
          <AdminsterSideBar />
        </div>

        {menuOpen && (
          <div className="md:hidden w-full">
             <AdminsterSideBar />
          </div>
        )}
      </div>
    </div>
  )
}
