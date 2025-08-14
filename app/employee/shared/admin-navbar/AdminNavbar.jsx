'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { IoMdPersonAdd, IoMdMenu } from "react-icons/io"
import { MdCancel } from "react-icons/md"


export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/team-leader/dashboard' },
    { name: 'Notification', href: '/notification' },
    { name: 'Review', href: '/review' },
  ]

  return (
    <Card className='w-full bg-[#8D92EB] text-white shadow-md rounded-none px-6 py-4 z-50 relative'>
      <nav className='flex items-center justify-between px-4 py-1 ml-14 mr-14'>
       
        <div className="flex items-center gap-2">
          <Image
            className='rounded-full'
            src='/image/astuLogo.png'
            height={50}
            width={50}
            alt='ASTU'
          />
          <span className='text-xl font-semibold'>Admin Panel</span>
        </div>

       
        <ul className='hidden md:flex gap-6 text-white'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className='hover:underline'>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

      
        <div className='hidden md:block'>
          <Link href='/profile'>
            <IoMdPersonAdd className='text-2xl' />
          </Link>
        </div>

   
        <div className='md:hidden text-2xl cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MdCancel /> : <IoMdMenu />}
        </div>
      </nav>

    
      {menuOpen && (
        <ul className='md:hidden flex flex-col items-start px-4 pb-4 gap-2'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className='block py-1'>
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href='/profile' className='block py-1'>
              Profile
            </Link>
          </li>
        </ul>
      )}
    </Card>
  )
}
