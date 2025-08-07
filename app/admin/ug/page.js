'use client'

import React from 'react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#9C8CF6]">
        <img src="/image/astuLogo.png" alt="Logo" className="w-12 h-12" />
        <div className="flex gap-4 items-center">
          <button className="bg-[#F5F5F5] text-black px-4 py-1 rounded-sm text-sm">
            profile
          </button>
        </div>
      </div>

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-60 bg-[#9C8CF6] text-white p-6 space-y-4 text-sm">
          <h2 className="text-lg font-semibold">My Work</h2>
          <ul className="space-y-2">
            <li><a href="#" className="block hover:underline">Home</a></li>
            <li><a href="#" className="block hover:underline">Teams</a></li>
            <li><a href="#" className="block hover:underline">Task</a></li>
            <li><a href="#" className="block hover:underline">Message</a></li>
            <li><a href="#" className="block hover:underline">Notification</a></li>
            <li><a href="#" className="block hover:underline">Files</a></li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tasks"
              className="w-1/2 p-2 rounded-full border border-gray-300 shadow-sm"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 text-lg font-medium border-b pb-2">
            <button className="hover:text-purple-700">Overview</button>
            <button className="hover:text-purple-700">Board</button>
            <button className="hover:text-purple-700">Calendar</button>
            <button className="hover:text-purple-700">Plan</button>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-2 gap-6">
            {/* Team Tasks */}
            <div className="bg-gray-100 p-4 shadow rounded-md">
              <h3 className="text-base font-semibold mb-3">Teams tasks</h3>
              <div className="flex gap-4">
                <button className="bg-[#9C8CF6] text-white px-4 py-2 rounded">employer name</button>
                <button className="bg-[#9C8CF6] text-white px-4 py-2 rounded">Select department</button>
              </div>
            </div>

            {/* Task Creation */}
            <div className="bg-gray-100 p-4 shadow rounded-md">
              <h3 className="text-base font-semibold mb-3">Task Creation form</h3>
              <div className="flex gap-4">
                <button className="bg-[#9C8CF6] text-white px-4 py-2 rounded">Create task</button>
                <button className="bg-[#9C8CF6] text-white px-4 py-2 rounded">select deadline</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs py-3 text-gray-500 bg-[#F5F5F5]">
        Copy Right Reserved
      </footer>
    </div>
  )
}
