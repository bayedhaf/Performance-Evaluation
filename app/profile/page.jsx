'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    // Set user data from session
    setUser({
      fullName: session.user.fullName || `${session.user.firstName} ${session.user.lastName}`,
      email: session.user.email,
      position: session.user.position || 'Employee',
      photo: session.user.profileImage || '/image/profile.png',
      role: session.user.role,
      employeeId: session.user.employeeId,
      department: session.user.department?.name || 'Not Assigned',
      team: session.user.team?.name || 'Not Assigned'
    })
    setLoading(false)
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No user data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          <Image
            src={user.photo}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full mb-4 object-cover"
            sizes="120px"
            onError={(e) => {
              e.target.src = '/image/profile.png'
            }}
          />
          <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-600">{user.position}</p>
          <p className="text-sm text-indigo-600 font-medium">{user.role}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-gray-700 font-semibold">Employee ID</h3>
            <p className="text-gray-600">{user.employeeId || 'Not Assigned'}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Department</h3>
            <p className="text-gray-600">{user.department}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Team</h3>
            <p className="text-gray-600">{user.team}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
