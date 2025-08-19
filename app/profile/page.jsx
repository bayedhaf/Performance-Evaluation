'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token') // JWT or auth token
        const res = await fetch('https://dummyjson.com/c/6830-f502-48c5-b775', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error(err)
        router.push('/login') // redirect to login if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          <Image
            src={user.photo || '/image/profile.png'}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-600">{user.position}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Phone</h3>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Country</h3>
            <p className="text-gray-600">{user.country}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Region</h3>
            <p className="text-gray-600">{user.region}</p>
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
