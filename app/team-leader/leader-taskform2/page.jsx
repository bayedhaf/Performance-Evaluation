'use client'
import TeamLeaderNavbar from '@/app/employee/shared/team-leadernavbar/TeamLeaderNavbar'
import TeamLeaderPeerTaskForm from '@/components/forms/TeamLeaderPeerTaskForm'

export default function Page() {
  return (
    <div>
      <TeamLeaderNavbar/>
      <TeamLeaderPeerTaskForm />
    </div>
  )
}
