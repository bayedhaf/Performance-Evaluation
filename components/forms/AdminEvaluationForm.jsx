import React from 'react'
import Image from 'next/image'
import { task, user } from './tasks' 

export default function AdminEvaluationForm() {
  return (
    <div className='px-4 py-8'>
     
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <Image
          src="/image/astuLogo.png"
          alt="ASTU Logo"
          width={100}
          height={100}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Adama Science And Technology University (ASTU)
        </h1>
        <p className="text-sm text-gray-600 max-w-md px-4">
          የሲቪል ሰርቪስ ሠራተኞች የሥራ አፈፃፀም ምዘና ውጤት መሙያ ቅጽ (70%) በቅርብ ኃላፊ የሚሞላ
        </p>
        <p className="text-sm text-black font-bold max-w-md px-4">
          Employer Name:{user.name} &nbsp;&nbsp; Type of Work Evaluation: {user.performance} &nbsp;&nbsp; Rank: {user.Rank}
        </p>
        <p className="text-sm text-black font-medium">Year of Evaluation: {user.data}</p>
      </div>

   
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold border-b pb-1 border-black">
          አ. አመለካከት <span className="text-green-600 font-bold">5%</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-black text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black px-2 py-1">ተ/ቁ</th>
                <th className="border border-black px-2 py-1">የተሰራው ስራ/ተግባር</th>
                <th className="border border-black px-2 py-1">ክብደት (100%)</th>
                <th colSpan={4} className="border border-black px-2 py-1">የአፈጻጸም ደረጃ</th>
                <th className="border border-black px-2 py-1">የተጠናከረ ነጥብ</th>
              </tr>
              <tr>
                <th colSpan={3}></th>
                <th className="border border-black px-2 py-1">1</th>
                <th className="border border-black px-2 py-1">2</th>
                <th className="border border-black px-2 py-1">3</th>
                <th className="border border-black px-2 py-1">4</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {task.map((item, i) => (
                <tr key={i}>
                  <td className="border border-black px-2 py-1">{i + 1}</td>
                  <td className="border border-black px-2 py-1 text-left">{item.task}</td>
                  <td className="border border-black px-2 py-1">{item.weight}</td>
                  <td className="border border-black px-2 py-1">{item.rank === 1 ? item.rank : ''}</td>
                  <td className="border border-black px-2 py-1">{item.rank === 2 ? item.rank : ''}</td>
                  <td className="border border-black px-2 py-1">{item.rank === 3 ? item.rank : ''}</td>
                  <td className="border border-black px-2 py-1">{item.rank === 4 ? item.rank : ''}</td>
                  <td className="border border-black px-2 py-1">{(item.rank * item.weight)/4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     
        <div className="mt-4 grid grid-cols-2 w-full max-w-md text-sm">
          <div className="border border-black px-4 py-2 font-medium">ድምር ነጥብ</div>
          <div className="border border-black px-4 py-2">{task.reduce((acc, item) => acc + ((item.rank * item.weight) / 4), 0)}</div>
          <div className="border border-black px-4 py-2 font-semibold">አማራጭ ውጤት</div>
          <div className="border border-black px-4 py-2 font-semibold">
          {task.reduce((acc, item) => acc + (item.rank * item.weight) / 4, 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
