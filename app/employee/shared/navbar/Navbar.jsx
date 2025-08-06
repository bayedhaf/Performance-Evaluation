'use client'

import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,

} from '@/components/ui/card'

export default function Navbar() {
  const navLinks = [
    { name: 'My Result', href: '/myresault' },
    { name: 'Complaints', href: '/complien' },
  ]

  return (
    <Card className="w-full bg-blue-900 text-white shadow-md rounded-none px-6 py-4">
      <CardHeader className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
     
        <Link href="/" className="font-bold text-2xl tracking-wide hover:text-blue-200 transition">
          Employer Dashboard
        </Link>

     
        <ul className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between">
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
          Profile
        </Link>
      </CardHeader>
    </Card>
  )
}
