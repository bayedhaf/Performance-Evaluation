'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function NewUserCreation() {
  return (
    <Card className="p-6 shadow-md rounded-xl bg-white hover:shadow-lg transition-shadow">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          New User Creation
        </h2>
        <p className="text-gray-500 text-sm">
          Add a new user to the system quickly and easily.
        </p>

        <Link
          href="/admin/dashboard/newusers"
          className="inline-block px-6 py-2 bg-[#8D92EB] text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all"
        >
          + Create New User
        </Link>
      </div>
    </Card>
  )
}
