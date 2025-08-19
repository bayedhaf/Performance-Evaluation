'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PeerEvaluation() {
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalRank, setTotalRank] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees from DB
  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const res = await fetch('https://dummyjson.com/c/ec54-cc72-4bec-8f36'); // Use your get API endpoint
        const data = await res.json();
        if (res.ok) {
          setEmployees(Array.isArray(data) ? data : []);
        } else {
          setMessage(`❌ Failed to fetch employees: ${data.message || 'Unknown error'}`);
        }
      } catch (err) {
        setMessage(`❌ Error fetching employees: ${err.message}`);
      }
      setLoading(false);
    }
    fetchEmployees();
  }, []);

  // Handle employee selection and fetch tasks
  const handleEmployeeChange = async (e) => {
    const empId = parseInt(e.target.value);
    const employee = employees.find(emp => emp.id === empId);
    setSelectedEmployee(employee || null);
    setTotal(0);
    setTotalRank(0);
    setTaskData([]);

    if (!employee) return;

    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/c/0b86-a366-4292-94b3`); // Use your get API endpoint
      const data = await res.json();
      if (res.ok) {
        setTaskData(Array.isArray(data) ? data.map(t => ({ ...t, rank: 0 })) : []);
      } else {
        setMessage(`❌ Failed to fetch tasks: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage(`❌ Error fetching tasks: ${err.message}`);
    }
    setLoading(false);
  };

  const getScore = (rank, weight) => (((rank * weight) / 4)*0.15);

  const calculateTotals = (data) => {
    const rankSum = data.reduce((sum, t) => sum + (t.rank || 0), 0);
    const scoreSum = data.reduce((sum, t) => sum + getScore(t.rank || 0, t.weight || 0), 0);
    setTotalRank(rankSum);
    setTotal(scoreSum);
  };

  const handleRankChange = (index, rank) => {
    const updated = [...taskData];
    updated[index].rank = parseInt(rank);
    setTaskData(updated);
    calculateTotals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setMessage('❌ Please select an employee first!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const payload = {
        employee: selectedEmployee,
        tasks: taskData,
        totalRank,
        totalScore: total,
        date: new Date().toISOString()
      };

      const res = await fetch('/api/submit-evaluation', {//post end point
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Evaluation for ${selectedEmployee.name} submitted successfully!`);
      } else {
        setMessage(`❌ Failed to submit: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Select Employee</label>
            <select
              onChange={handleEmployeeChange}
              value={selectedEmployee?.id || ''}
              className="border p-2 rounded w-full"
              disabled={loading}
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-4xl mx-auto mb-6">
              {[
                { label: 'Full Name', value: selectedEmployee.name },
                { label: 'Job Type', value: selectedEmployee.jobType },
                { label: 'Evaluation', value: selectedEmployee.evaluation },
                { label: 'Position', value: selectedEmployee.position },
                { label: 'Year', value: selectedEmployee.year },
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
          )}

          {selectedEmployee && taskData.length > 0 && (
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
                  {taskData.map((item, i) => (
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
                            disabled={loading}
                          />
                        </td>
                      ))}
                      <td className="border-t px-2 py-2 font-semibold text-indigo-600">
                        {getScore(item.rank, item.weight).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedEmployee && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 font-medium text-gray-700">
                Total Rank: <span className="font-bold">{totalRank.toFixed(2)}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 font-medium text-gray-700">
                Total Score: <span className="font-bold text-green-700">{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {message && <p className="text-center font-medium mt-4">{message}</p>}

          {selectedEmployee && (
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
          )}
        </form>
      </div>
    </div>
  );
}