'use client'

import React, { useEffect, useState } from 'react'
import TeamLeaderNavbar from '@/app/employee/shared/team-leadernavbar/TeamLeaderNavbar'

export default function TeamLeaderTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/api/tasks')
        if (!res.ok) throw new Error('Failed to load tasks')
        const data = await res.json()
        setTasks(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamLeaderNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Assigned To</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Due</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id} className="border-t">
                    <td className="p-2">{t.title}</td>
                    <td className="p-2">{t.assignedTo?.firstName} {t.assignedTo?.lastName}</td>
                    <td className="p-2">{t.category}</td>
                    <td className="p-2">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-2">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

 

