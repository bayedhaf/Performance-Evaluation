'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function UserComplain() {
  return (
    <Card className="p-6 shadow-md rounded-xl bg-white hover:shadow-lg transition-shadow">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">
          User Complaints
        </h2>
        <p className="text-gray-500 text-sm">
          View and manage user complaints submitted through the system.
        </p>
        <div className="mt-4">
          <Link
            href="/admin/dashboard/complain"
            className="inline-block px-6 py-2 bg-[#8D92EB] text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all"
          >
            View Reports
          </Link>
        </div>
      </div>
    </Card>
  )
}
