'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SideBar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/employee/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error('Error fetching user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUserData();
  }, [])

  if (!user) {
    return (
      <Card className="h-screen w-full sm:w-64 pt-6 bg-white shadow-xl border-r flex flex-col items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </Card>
    )
  }

  return (
    <Card className="h-screen w-full sm:w-64 pt-6 bg-white shadow-xl border-r flex flex-col">
      <CardHeader className="text-center border-b py-6 bg-[#8D92EB] text-white shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src={user.profileImage || '/image/astuLogo.png'}
            alt="Profile"
            width={80}
            height={80}
            unoptimized
            className="rounded-full object-cover mb-2 shadow-md"
          />
          <CardTitle className="text-white text-lg font-semibold tracking-wide">
            <span className="font-semibold text-black">Full Name:</span> {user.fullName}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-sm text-gray-800">
        <Link className="text-blue-700 hover:underline" href="/employee/employee_profile_edit">
          Edit Profile
        </Link>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Department:</span>
          <span>{user.department || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Email:</span>
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Phone:</span>
          <span>{user.phone || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Position:</span>
          <span>{user.position || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
