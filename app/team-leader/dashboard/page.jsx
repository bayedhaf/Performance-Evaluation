'use client'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
export default function Page() {
 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     <main className="flex-1 p-4">
      
     <div className="mb-6">
            <input
              type="text"
              placeholder="Search tasks"
              className="w-1/2 p-2 rounded-full border border-gray-300 shadow-sm"
            />
        </div>
      <div className="flex flex-wrap bg-[#D9D9D9]  justify-around items-center gap-4 mb-6 mr-6">
    <Link href="/overview" className="text-sm md:text-sm font-medium text-gray-600 hover:underline">
      Overview
    </Link>
    <Link href="/board" className="text-sm md:text-sm font-medium text-gray-600 hover:underline">
      Board
    </Link>
    <Link href="/calender" className="text-sm md:text-sm font-medium text-gray-600 hover:underline">
      Calendar
    </Link>
    <Link href="/plan" className="text-sm md:text-sm font-medium text-gray-600 hover:underline">
      Plan
    </Link>
  </div>


  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 max-w-5xl mx-auto">
  <Card className="p-6 shadow-md bg-[#D9D9D9] w-full sm:w-auto rounded-lg">
    <h1 className="text-2xl font-bold text-black">Teams tasks</h1>
    <div className="flex flex-row  items-center justify-around gap-6">
      <div className="bg-[#8D92EB] rounded-2xl  mt-2 text-white items-center text-center font-bold hover:underline hover:text-[#D9D9D9] px-4 py-2">
        Select the employee name
      </div>
      <div className="bg-[#8D92EB]  rounded-2xl mt-2 text-white items-center text-center font-bold hover:underline hover:text-[#D9D9D9] px-4 py-2">
        Select task type
      </div>
    </div>
  </Card>

  <Card className="p-6 shadow-md bg-[#D9D9D9] w-full sm:w-auto rounded-lg">
    <h1 className="text-2xl font-bold text-black">Employee Tasks</h1>
    <div className="flex  mt-2 flex-row  items-center justify-around gap-6">
      <div className="bg-[#8D92EB]  rounded-2xl mt-2 text-white items-center text-center font-bold hover:underline hover:text-[#D9D9D9] px-4 py-2">
        Select tasks type
      </div>
      <div className="bg-[#8D92EB]  rounded-2xl mt-2 text-white items-center text-center font-bold hover:underline hover:text-[#D9D9D9] px-4 py-2">
        Create Task
      </div>
    </div>
  </Card>
</div>

</main>

  </div>
   
  )
}
