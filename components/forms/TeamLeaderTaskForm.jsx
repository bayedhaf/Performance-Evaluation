'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TeamLeaderTaskForm() {
  const [users, setUsers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState('');
  const [shareWithTeam, setShareWithTeam] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/team/members');
        const data = await res.json();
        console.log('Team members response:', data); // Debug log
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error('Error fetching team members:', err); // Debug log
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const employee = users.find((u) => (u._id || u.id) === empId);
    setSelectedEmployee(employee || null);
  };

  const handleRankChange = (index, value) => {
    const updatedTasks = [...taskData];
    updatedTasks[index].rank = Number(value);
    setTaskData(updatedTasks);
  };

  const getScore = (rank, weight) => ((rank * weight) / 4) * 0.7;
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
      title: `Team Leader Evaluation Tasks (${new Date().getFullYear()})`,
      description: 'Tasks for 70% team leader evaluation',
      assignedTo: selectedEmployee._id || selectedEmployee.id,
      priority: 'medium',
      category: 'other',
      evaluationCriteria: taskData.map((t) => ({ criterion: t.name, weight: Number(t.weight) })),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxScore: 70,
      shareWithTeam: shareWithTeam
    };

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create tasks');
      }

      setMessage('Tasks created successfully!');
      setSelectedEmployee(null);
      setTaskData([]);
      setNewTask({ name: '', weight: '', rank: 0 });
      setShareWithTeam(false);
    } catch (error) {
      console.error(error);
      setMessage('Error submitting evaluation: ' + error.message);
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
            Team Leader Task Creation
          </h1>
          <p className="text-gray-600">Create evaluation tasks for your team members</p>
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
                value={(selectedEmployee?._id || selectedEmployee?.id) || ''}
              >
                <option value="">Choose an employee</option>
                {users.map((emp) => (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {emp.fullName || emp.name} - {emp.position || emp.role}
                  </option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No team members found. Make sure you have a team assigned.
                </p>
              )}
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row flex-wrap gap-3 text-sm font-medium text-gray-800 border border-gray-200">
              <span><strong>Employee:</strong> {selectedEmployee.fullName || selectedEmployee.name}</span>
              <span><strong>Position:</strong> {selectedEmployee.position || 'N/A'}</span>
              <span><strong>Role:</strong> {selectedEmployee.role || 'N/A'}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="shareWithTeam"
              checked={shareWithTeam}
              onChange={(e) => setShareWithTeam(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="shareWithTeam" className="text-sm font-medium text-gray-700">
              Share this task with all team members
            </label>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm sm:text-base text-center">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-2">No.</th>
                  <th className="px-3 py-2">Task Listed</th>
                  <th className="px-3 py-2">Task Division (100%)</th>
                  <th colSpan={4} className="px-3 py-2">Task Division Out of 24</th>
                  <th className="px-3 py-2">Result Out of 70%</th>
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

          {message && (
            <div className={`p-4 rounded-lg text-center ${
              message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
          
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-transform transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Tasks...' : 'Create Tasks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

