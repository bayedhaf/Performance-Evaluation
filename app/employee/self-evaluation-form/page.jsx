'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { taskDatas } from '@/components/forms/tasks';

export default function SelfEvaluation() {
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });
  const [total, setTotal] = useState(0);
  const [totalRank, setTotalRank] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setMessage('Evaluation submitted successfully!');
      setLoading(false);
    }, 1200);
  };

  const handleRankChange = (index, rank) => {
    const updated = [...taskData];
    updated[index].rank = rank;
    setTaskData(updated);
    calculateTotals(updated);
  };

  const getScore = (rank, weight) => (rank * weight) / 4;

  const calculateTotals = (data) => {
    const rankSum = data.reduce((sum, t) => sum + (t.rank || 0), 0);
    const scoreSum = data.reduce((sum, t) => sum + getScore(t.rank, t.weight || 0), 0);
    setTotalRank(rankSum);
    setTotal(scoreSum);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-7xl">
     
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <Image
            src="/image/astuLogo.png"
            alt="ASTU Logo"
            width={100}
            height={100}
            className="rounded-full shadow-lg border border-gray-200"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Adama Science and Technology University (ASTU)
          </h1>
        </div>

      
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6"
        >
         
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Full Name', value: 'famo Doje' },
              { label: 'Job Type', value: 'Instructor' },
              { label: 'Evaluation', value: 'Mid-Year' },
              { label: 'Position', value: 'Lecturer' },
              { label: 'Year', value: '2025' },
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  readOnly
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            ))}
          </div>


          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm sm:text-base text-center">
              <thead>
                <tr className="bg-indigo-100">
                
                  <th className="px-3 py-2">No.</th>
                  <th className="px-3 py-2">Task Name</th>
                  <th className="px-3 py-2">Weight (%)</th>
                  {[1, 2, 3, 4].map((n) => (
                    <th key={n} className="px-2 py-1">{n}</th>
                  ))}
                  <th className="px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {taskDatas.map((item, i) => (
                  <tr key={item.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="border-t px-2 py-2">{i + 1}</td>
                    <td className="border-t px-2 py-2 text-left">{item.name}</td>
                    <td className="border-t px-2 py-2">{item.weight}</td>
                    {[1, 2, 3, 4].map((num) => (
                      <td key={`rank-${item.id}-${num}`} className="border-t px-2 py-2">
                        <input
                          type="radio"
                          name={`rank-${i}`}
                          value={num}
                          checked={item.rank === num}
                          onChange={() => handleRankChange(i, num)}
                          className="cursor-pointer accent-indigo-500"
                        />
                      </td>
                    ))}
                    <td className="border-t px-2 py-2 font-semibold text-indigo-600">
                      {getScore(item.rank, item.weight).toFixed(2)}
                    </td>
                  </tr>
                ))}

              
                <tr>
                  <td className="border-t px-2 py-2">+</td>
                  <td className="border-t px-2 py-2">
                    <input
                      type="text"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="New task name"
                    />
                  </td>
                  <td className="border-t px-2 py-2">
                    <input
                      type="number"
                      value={newTask.weight}
                      onChange={(e) => setNewTask({ ...newTask, weight: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="%"
                    />
                  </td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 font-medium text-gray-700">
              Total Rank: <span className="font-bold">{totalRank.toFixed(2)}</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 font-medium text-gray-700">
              Total Score: <span className="font-bold text-green-700">{total.toFixed(2)}</span>
            </div>
          </div>

        
          {message && <p className="text-center text-green-600 font-medium">{message}</p>}

        
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-transform transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
