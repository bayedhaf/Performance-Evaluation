'use client'

import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { IoMdPersonAdd } from "react-icons/io"
import Image from 'next/image'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/employee/employee-dashboard' },
    { name: 'My Result', href: '/employee/employee-result' },

  ]

  return (
    <Card className="w-full bg-[#8D92EB] text-white shadow-lg rounded-none px-6 py-4 z-50 relative">
      <nav className="flex items-center justify-between px-4 py-1 ml-6 mr-6">
        
     
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              className="rounded-full shadow-md"
              src="/image/astuLogo.png"
              height={48}
              width={48}
              alt="ASTU"
            />
            <span className="text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm">
              Employer Dashboard
            </span>
          </Link>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          <ul className="flex gap-8 items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-lg font-medium after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:bottom-[-4px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/profile"
            className="p-2 rounded-full bg-white/20 hover:scale-105 transition-transform duration-300 shadow-md"
          >
            <IoMdPersonAdd size={22} />
          </Link>
        </div>

      
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden cursor-pointer text-3xl text-white"
        >
          {menuOpen ? <MdCancel /> : <IoMdMenu />}
        </div>
      </nav>

     
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 text-blue-900 shadow-lg py-6 z-50 rounded-b-lg animate-fadeIn">
          <ul className="flex flex-col gap-6 px-8 font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-lg transition-transform hover:scale-105"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/profile"
                className="block text-lg transition-transform hover:scale-105"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
    </Card>
  )
}
