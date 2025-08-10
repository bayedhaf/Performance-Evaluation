'use client'

import React, { useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { MdCancel } from "react-icons/md"
import SideBar from './page'

export default function TogleSideBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative">
    
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 cursor-pointer text-2xl text-gray-700 block md:hidden"
      >
        {menuOpen ? <MdCancel /> : <IoMdMenu />}
      </div>

     
      <div className="hidden md:block">
        <SideBar />
      </div>

    
      {menuOpen && (
        <div className="block md:hidden absolute top-12 left-0 z-50 bg-white shadow-lg w-3/4 h-screen">
          <SideBar />
        </div>
      )}
    </div>
  )
}
