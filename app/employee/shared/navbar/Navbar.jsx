'use client'

import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import Link from 'next/link'
import { Card} from '@/components/ui/card'
import { IoMdPersonAdd } from "react-icons/io"
import Image from 'next/image'
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'My Result', href: '/myresault' },
    { name: 'Complaints', href: '/complien' },
  ]

  return (
    <Card className="w-full bg-[#8D92EB] text-white shadow-md rounded-none px-6 py-4 z-50 relative">
      <nav className='flex items-center justify-between px-4 py-1 ml-14 mr-14'>
         <div className="flex items-center gap-2">
                
        <Link
          href="/"
          className="font-bold text-2xl tracking-wide hover:text-blue-200 transition"
        >
                  <Image
                    className='rounded-full'
                    src='/image/astuLogo.png'
                    height={50}
                    width={50}
                    alt='ASTU'
                  />
                <span className='text-xl font-semibold'>Employer Dashboard</span>
                </Link> 
                  </div>
      
      <div className="hidden md:flex gap-6 items-center">
          <ul className="flex gap-6 items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-blue-300 text-lg transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/profile"
            className="hover:text-blue-300 text-lg font-medium transition"
          >
            <IoMdPersonAdd/>
          </Link>
        </div>

        
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden cursor-pointer text-2xl text-white"
        >
          {menuOpen ? <MdCancel /> : <IoMdMenu />}
        </div>

           
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white text-blue-900 shadow-md py-4 z-50">
          <ul className="flex flex-col gap-4 px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg hover:text-blue-700 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/profile"
                className="text-lg hover:text-blue-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
   </nav>

  
    </Card>
  )
}
