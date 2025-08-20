'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsMicrosoftTeams } from 'react-icons/bs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

export default function AdminSideBar() {
  const [leaderData, setLeaderData] = useState(null)

  useEffect(() => {
    async function fetchLeaderData() {
      try {
        const res = await fetch('https://dummyjson.com/c/03cd-43ab-48a4-88a2') // your backend endpoint
        const data = await res.json()
        setLeaderData(data)
      } catch (err) {
        console.error('Error fetching leader data:', err)
        // Set fallback data if API fails
        setLeaderData({
          logo: '/image/astuLogo.png',
          name: 'Admin Dashboard'
        })
      }
    }
    fetchLeaderData()
  }, [])

  if (!leaderData) {
    return (
      <Card className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col">
        <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
          <p>Loading...</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col">
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={leaderData.logo || '/image/astuLogo.png'}
            alt="Leader Logo"
            width={80}
            height={80}
            className="rounded-full object-cover mb-2"
            sizes="80px"
            onError={(e) => {
              e.target.src = '/image/astuLogo.png'
            }}
          />
          <CardTitle className="text-lg font-semibold tracking-wide">
            {leaderData.name || 'Admin Dashboard'}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 py-6 px-4 text-gray-700">
        <Link href="/team-leader/dashboard" className="block">
          <SidebarItem label="Home" />
        </Link>
        <Link href="teams" className="block">
          <SidebarItem label="Teams" />
        </Link>
      </CardContent>
    </Card>
  )
}

function SidebarItem({ label }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-all">
      <BsMicrosoftTeams className="text-xl" />
      <span className="text-base font-medium">{label}</span>
    </div>
  )
}
