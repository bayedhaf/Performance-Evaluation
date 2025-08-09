'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'


export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-100">
       <main className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-between items-stretch">

       
          <Card className="w-full md:w-1/3 bg-zinc-200 text-blue-900 text-center p-6 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Self Evaluation Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="#" className="text-blue-700 underline hover:text-blue-900 transition">Find Users</Link>
            </CardContent>
          </Card>

       
          <Card className="w-full md:w-1/3 bg-zinc-200 text-blue-900 text-center p-6 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Peer Evaluation Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="#" className="text-blue-700 underline hover:text-blue-900 transition">Find Users</Link>
            </CardContent>
          </Card>

        
          <Card className="w-full md:w-1/3 bg-zinc-200 text-blue-900 text-center p-6 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">My Result</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="#" className="text-blue-700 underline hover:text-blue-900 transition">Find Users</Link>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
