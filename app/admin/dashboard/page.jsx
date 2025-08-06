'use client'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
export default function Page() {
 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     <main className="flex-1 p-4">

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
    <Link href="/overview" className="text-lg md:text-2xl font-medium text-gray-600 hover:underline">
      Overview
    </Link>
    <Link href="/board" className="text-lg md:text-2xl font-medium text-gray-600 hover:underline">
      Board
    </Link>
    <Link href="/calender" className="text-lg md:text-2xl font-medium text-gray-600 hover:underline">
      Calendar
    </Link>
    <Link href="/plan" className="text-lg md:text-2xl font-medium text-gray-600 hover:underline">
      Plan
    </Link>
  </div>


  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 max-w-5xl mx-auto">
  <Card className="p-6 shadow-md bg-[#D9D9D9] w-full sm:w-auto">
    <h1 className="text-2xl font-bold text-black">Welcome Admin 👋</h1>
    <p className="mt-2 text-gray-700">Here is dashboard content.</p>
  </Card>

  <Card className="p-6 shadow-md bg-[#D9D9D9] w-full sm:w-auto">
    <h1 className="text-2xl font-bold text-black">Welcome Admin3 👋</h1>
    <p className="mt-2 text-gray-700">Here is dashboard content.</p>
  </Card>
</div>

</main>

  </div>
   
  )
}
