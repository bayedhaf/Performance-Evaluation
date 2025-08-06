'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import React from 'react'
import Image from 'next/image'
export default function SideBar() {
  return (
    <Card className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col">
      
    
      <CardHeader className="text-center border-b py-6 bg-blue-900 text-white shadow-md">
        <CardTitle className="text-lg font-semibold tracking-wide">
        <Image
                src="/image/astuLogo.png"
                alt="ASTU Logo"
                width={100}
                height={100}
                className="rounded-full object-cover"
                />
        </CardTitle>
      </CardHeader>

    
      <div className="flex flex-col gap-4 p-6">

        <Card className="bg-amber-100 hover:bg-amber-200 transition cursor-pointer shadow-sm">
          <CardContent className="text-blue-700 font-medium py-4 text-center">
            User Data
          </CardContent>
        </Card>

        <Card className="bg-amber-100 hover:bg-amber-200 transition cursor-pointer shadow-sm">
          <CardContent className="text-blue-700 font-medium py-4 text-center">
            User Data Info
          </CardContent>
        </Card>

      </div>
    </Card>
  )
}
