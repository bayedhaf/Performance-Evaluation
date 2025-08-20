

import React from 'react'
import TeamLeaderNavbar from '@/app/employee/shared/team-leadernavbar/TeamLeaderNavbar'
import TogleTeamLeaderSideBar from '@/app/employee/shared/team-leadernavbar/TogleTeamLeaderSideBar';



export const metadata = {
  title: {
    default: 'ASTU Staff Performance Evaluator',
    absolute: 'ASTU Staff Evaluation',
  },
  description: "Formed by ASTU Civil and Service",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
    
      <div className="sticky top-0 z-50 shadow">
        < TeamLeaderNavbar />
      </div>

     
      <div className="flex flex-1">
    
        <TogleTeamLeaderSideBar />

      
        <main className="flex-1 px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
