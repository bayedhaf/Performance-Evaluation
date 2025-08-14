'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { task as users } from './tasks';

export default function AdminEvaluationForm() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const employee = users.find((u) => u.id.toString() === empId);
    setSelectedEmployee(employee);
  };

  const handleRankChange = (index, value) => {
    const updatedTasks = [...taskData];
    updatedTasks[index].rank = Number(value);
    setTaskData(updatedTasks);
  };

  const getScore = (rank, weight) => ((rank * weight) / 4) * 0.7;
  const getRank = (rank) => rank;

  const totalRank = taskData.reduce((acc, item) => acc + getRank(item.rank), 0);
  const total = taskData.reduce((acc, item) => acc + getScore(item.rank, item.weight), 0);

  const handleAddTask = () => {
    if (!newTask.name || !newTask.weight) return;
    setTaskData([...taskData, { ...newTask, id: Date.now() }]);
    setNewTask({ name: '', weight: '', rank: 0 });
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

        <form className="bg-white/70 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 items-start w-full max-w-2xl mx-auto">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Select Employee:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                onChange={handleEmployeeChange}
              >
                <option value="" disabled>Choose an employee</option>
                {users.map((emp) => (
                  <option key={emp.id} value={emp.id} 
                  className='text-black'>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Task Value
              </label>
              <input
                type="number"
                placeholder="Enter task value"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
              />
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row flex-wrap gap-3 text-sm font-medium text-gray-800 border border-gray-200">
              <span>
                <strong>Employer Name:</strong> {selectedEmployee.name}
              </span>
              <span>
                <strong>Evaluation:</strong> {selectedEmployee.performance}
              </span>
              <span>
                <strong>Rank:</strong> {selectedEmployee.rank}
              </span>
              <span>
                <strong>Year:</strong> {selectedEmployee.data}
              </span>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm sm:text-base text-center">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-2">No.</th>
                  <th className="px-3 py-2">Task Listed</th>
                  <th className="px-3 py-2">Task Division (100%)</th>
                  <th colSpan={4} className="px-3 py-2">
                    Task Division Out of 24
                  </th>
                  <th className="px-3 py-2">Result Out of 70%</th>
                </tr>
                <tr className="bg-indigo-50">
                  <th colSpan={3}></th>
                  {[1, 2, 3, 4].map((n) => (
                    <th key={n} className="px-2 py-1">
                      {n}
                    </th>
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
                      <td key={num} className="border-t px-2 py-2">
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

          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
            >
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
