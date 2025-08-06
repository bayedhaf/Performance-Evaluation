import React from 'react'
import Navbar from '../shared/navbar/Navbar';

export const metadata = {
  title: {
    default:' ASTU Staff Performance Evaluator',
    absolute:' ASTU Staff Self and Peer Evalauation'
  },
  description: "Formed by ASTU Civil and Service",
};

export default function EmployeeLayout({children}) {
  return (
    <div className='bg-zinc-100'>
      <main className="">
        <Navbar/>
       {children}
      </main>
    </div>
  )
}
