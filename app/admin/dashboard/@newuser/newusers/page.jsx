'use client'


import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function NewUserCreationForms() {
  return (
    <div className="min-h-screen bg-gray-200 p-8 flex flex-col items-center font-sans">
    
      <header className="w-full max-w-4xl bg-indigo-400 flex items-center px-4 py-2 mb-4">
        <img
          src="image/astuLogo.png"
          alt="ASTU Logo"
          className="w-12 h-12 mr-4"
        />
        <nav className="flex space-x-6 text-white text-lg font-semibold">
          <Link href="#" className="hover:underline">dashboard</Link>
          <Link href="#" className="hover:underline">employee</Link>
          <Link href="#" className="hover:underline">department</Link>
          <Link href="#" className="hover:underline">report</Link>
        </nav>
      </header>

    
      <div className="w-full max-w-4xl bg-gray-300 p-4 mb-6 text-center">
        <h1 className="text-xl font-semibold">ASTU</h1>
        <p className="text-lg font-medium">Employee registration form</p>
      </div>

   
      <form className="w-full max-w-4xl bg-gray-300 p-6 grid grid-cols-2 gap-6 rounded-md">
    
        <fieldset className="space-y-3 bg-gray-200 p-4 rounded">
          <legend className="font-semibold mb-2">personal information</legend>

          <label className="block">
            Full name:
            <input
              type="text"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            gender:
            <input
              type="text"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            date of birth:
            <input
              type="date"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            email address:
            <input
              type="email"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            Password:
            <input
              type="password"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            phone no.:
            <input
              type="tel"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            country:
            <input
              type="text"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            region/state:
            <input
              type="text"
              className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            photo:
            <input
              type="file"
              className="ml-2 w-full bg-gray-100 border border-gray-300 rounded"
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full bg-indigo-400 text-white py-2 rounded hover:bg-indigo-500 transition"
          >
            Submit
          </button>
        </fieldset>

        <div className="space-y-6">
         
          <fieldset className="space-y-3 bg-gray-200 p-4 rounded">
            <legend className="font-semibold mb-2">Education background</legend>

            <label className="block">
              Posotion:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              level:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              exprience:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              Field of study:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              department:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              inst name:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>
          </fieldset>

          <fieldset className="space-y-3 bg-gray-200 p-4 rounded">
            <legend className="font-semibold mb-2">Emergence contant info</legend>

            <label className="block">
              Full name:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              Relation:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              email/phone:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>

            <label className="block">
              job:
              <input
                type="text"
                className="ml-2 px-2 py-1 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </label>
          </fieldset>
        </div>
      </form>
    </div>
  );
}