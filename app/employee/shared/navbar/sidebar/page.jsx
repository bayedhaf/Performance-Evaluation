'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SideBar() {
  const [User, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('https://dummyjson.com/c/cbc7-3ad9-4912-8739');
      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, []);

  if (!User) {
    return (
      <Card className="h-screen w-full sm:w-64 pt-6 bg-white shadow-xl border-r flex flex-col items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </Card>
    );
  }

  return (
    <Card className="h-screen w-full sm:w-64 pt-6 bg-white shadow-xl border-r flex flex-col">
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src={User?.avatar|| '/default-profile.png'}
            alt="Profile"
            width={80}
            height={80}
            unoptimized
            className="rounded-full object-cover mb-2 shadow-md"
          />
          <CardTitle className="text-white text-lg font-semibold tracking-wide">
            <span className="font-semibold text-black">Full Name:</span> {User.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-sm text-gray-800">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Department:</span>
          <span>{User.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Email:</span>
          <span className="truncate">{User.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Phone:</span>
          <span>{User.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">City:</span>
          <span>{User.address?.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Status:</span>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
            {User.status}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}