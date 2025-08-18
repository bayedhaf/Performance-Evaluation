'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFileSignature } from "react-icons/fa"
import { BsMicrosoftTeams } from "react-icons/bs"
import { SiGoogletasks } from "react-icons/si"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

export default function AdminSideBar() {
  return (
    <Card className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col">
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/image/astuLogo.png"
            alt="ASTU Logo"
            width={80}
            height={80}
            className="rounded-full object-cover mb-2"
          />
          <CardTitle className="text-lg font-semibold tracking-wide">
            My Work
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 py-6 px-4 text-gray-700">
        <Link href="teams" className="block">
          <SidebarItem icon={<BsMicrosoftTeams />} label="Teams" />
        </Link>

        <SidebarItem icon={<SiGoogletasks />} label="Tasks" />
        <SidebarItem icon={<FaFileSignature />} label="Files" />
      </CardContent>
    </Card>
  )
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-all">
      <span className="text-xl">{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </div>
  )
}
