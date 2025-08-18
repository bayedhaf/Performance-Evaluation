'use client'

import React, { useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { MdCancel } from "react-icons/md"
import SideBar from './page'

export default function ToggleSideBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative">
     
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2  cursor-pointer text-3xl text-gray-700 block md:hidden"
      >
        {menuOpen ? <MdCancel /> : <IoMdMenu />}
      </div>

    
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div
        className={`fixed  left-0 z-50 w-3/4 sm:w-2/3 h-screen bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar />
      </div>
    </div>
  )
}
