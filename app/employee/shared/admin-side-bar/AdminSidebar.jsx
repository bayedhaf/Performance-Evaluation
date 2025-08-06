'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import React from 'react'
import Image from 'next/image'
export default function AdminSideBar() {
  return (
    <Card className="h-screen w-full sm:w-64 bg-white shadow-xl border-r flex flex-col">
      
    
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <CardTitle className="text-lg font-semibold tracking-wide">
        <Image
                src="/image/astuLogo.png"
                alt="ASTU Logo"
                width={100}
                height={100}
                className="rounded-full object-cover"
                />
        </CardTitle>
        <h1 className="">My work</h1>
      </CardHeader>
     <div className=""> Home</div>
     <div className="">Teams</div>
     <div className="">Tasks</div>
     <div className="">Message</div>
     <div className="">Notification</div>
     <div className="">Files</div>
    
      
    </Card>
  )
}
