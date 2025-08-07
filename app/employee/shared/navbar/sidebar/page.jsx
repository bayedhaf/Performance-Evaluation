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
    <Card className="h-screen w-full sm:w-64 pt-6 bg-white shadow-xl border-r flex flex-col ">
    
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src="/image/me.jpg"
            alt="ASTU Logo"
            width={80}
            height={80}
            className="rounded-full object-cover mb-2"
          />
          <CardTitle className="text-white text-lg font-semibold tracking-wide">
          <span className="font-semibold text-black">Full Name:</span> Bayisa Balcha
          </CardTitle>
        </div>
      </CardHeader>

    
      <CardContent className="p-4 space-y-3 text-sm text-gray-800">
       
        <div>
          <span className="font-semibold text-gray-600">Position:</span> Senior Software Engineer
        </div>
        <div>
          <span className="font-semibold text-gray-600">Department:</span> Software Engineering
        </div>
        <div>
          <span className="font-semibold text-gray-600">Email:</span> bayisa@example.com
        </div>
        <div>
          <span className="font-semibold text-gray-600">Phone:</span> +251 95 123 4567
        </div>
        <div>
          <span className="font-semibold text-gray-600">Status:</span> Active
        </div>
      </CardContent>
    </Card>
  )
}
