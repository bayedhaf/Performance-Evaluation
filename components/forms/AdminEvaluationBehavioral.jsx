'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminEvaluationBehavioral() {
  const [users, setUsers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState('');


  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://dummyjson.com/c/1b8a-19cc-41c5-bbd8'); // Replace with your get endpoint
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  const handleEmployeeChange = (e) => {
    const empId = Number(e.target.value);
    const employee = users.find((u) => u.id === empId);
    setSelectedEmployee(employee || null);
  };

  const handleRankChange = (index, value) => {
    const updatedTasks = [...taskData];
    updatedTasks[index].rank = Number(value);
    setTaskData(updatedTasks);
  };

  const getScore = (rank, weight) => ((rank * weight) / 4) * 0.1;
  const totalRank = taskData.reduce((acc, item) => acc + (item.rank || 0), 0);
  const total = taskData.reduce((acc, item) => acc + getScore(item.rank || 0, item.weight || 0), 0);

  const handleAddTask = () => {
    if (!newTask.name || !newTask.weight) return;
    setTaskData([...taskData, { ...newTask, id: Date.now() }]);
    setNewTask({ name: '', weight: '', rank: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      setMessage('Please select an employee before submitting.');
      return;
    }

    if (taskData.length === 0) {
      setMessage('Please add at least one task.');
      return;
    }

    const payload = {
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      tasks: taskData.map((t) => ({ name: t.name, weight: t.weight, rank: t.rank })),
      totalRank,
      totalScore: total,
      year: selectedEmployee.year || new Date().getFullYear(),
    };

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/evaluations', {//post api end point
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit evaluation');

      setMessage('Evaluation submitted successfully!');
      setSelectedEmployee(null);
      setTaskData([]);
      setNewTask({ name: '', weight: '', rank: 0 });
    } catch (error) {
      console.error(error);
      setMessage('Error submitting evaluation.');
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
          className="bg-white/70 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 items-start w-full max-w-2xl mx-auto">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Select Employee:</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                onChange={handleEmployeeChange}
                value={selectedEmployee?.id || ''}
              >
                <option value="">Choose an employee</option>
                {users.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row flex-wrap gap-3 text-sm font-medium text-gray-800 border border-gray-200">
              <span><strong>Employer Name:</strong> {selectedEmployee.name}</span>
              <span><strong>Evaluation:</strong> {selectedEmployee.performance}</span>
              <span><strong>Rank:</strong> {selectedEmployee.rank}</span>
              <span><strong>Year:</strong> {selectedEmployee.year || new Date().getFullYear()}</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm sm:text-base text-center">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-2">No.</th>
                  <th className="px-3 py-2">Task Listed</th>
                  <th className="px-3 py-2">Task Division (100%)</th>
                  <th colSpan={4} className="px-3 py-2">Task Division </th>
                  <th className="px-3 py-2">Result Out of 10%</th>
                </tr>
                <tr className="bg-indigo-50">
                  <th colSpan={3}></th>
                  {[1, 2, 3, 4].map((n) => (
                    <th key={`rank-header-${n}`} className="px-2 py-1">{n}</th>
                  ))}
                  <th></th>
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
                  <td colSpan={4} className="border-t px-2 py-2">
                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add Task
                    </button>
                  </td>
                  <td className="border-t px-2 py-2"></td>
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

          {message && <p className="text-center text-red-600 font-medium">{message}</p>}
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