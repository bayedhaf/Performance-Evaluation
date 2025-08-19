'use client'

import { FaArrowRightToBracket } from "react-icons/fa6";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <main className="w-full max-w-7xl mb-30">
        <h1 className="text-3xl md:text-4xl mt-0 font-bold text-center text-gray-800 mb-10 bg-gray-200">
          Evaluation Dashboard
        </h1>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
        
          <Card className="group bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transform transition-all duration-300 p-6 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold ">
                Self Evaluation Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href="self-evaluation-form" 
                className="flex items-center justify-center gap-2 text-blue-600 font-medium group-hover:text-blue-800 transition"
              >
                <FaArrowRightToBracket className="text-xl" /> Self Evaluation
              </Link>
            </CardContent>
          </Card>

        
          <Card className="group bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transform transition-all duration-300 p-6 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold">
                Peer Evaluation Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href="peer-evaluation" 
                className="flex items-center justify-center gap-2 text-blue-600 font-medium group-hover:text-blue-800 transition"
              >
                <FaArrowRightToBracket className="text-xl" /> See the Peer Task
              </Link>
            </CardContent>
          </Card>

        
          <Card className="group bg-white text-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transform transition-all duration-300 p-6 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold">
                My Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href="/employee/employee-result" 
                className="flex items-center justify-center gap-2 text-blue-600 font-medium group-hover:text-blue-800 transition"
              >
                <FaArrowRightToBracket className="text-xl" /> See Your Result
              </Link>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
