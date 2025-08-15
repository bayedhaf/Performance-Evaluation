'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { taskDatas } from '@/components/forms/tasks';

// Temporary static employees list (replace with API/DB fetch)
const employees = [
  { id: 1, name: 'Famo Doje', jobType: 'Instructor', evaluation: 'Mid-Year', position: 'Lecturer', year: 2025 },
  { id: 2, name: 'Selam Abebe', jobType: 'Researcher', evaluation: 'End-Year', position: 'Assistant Prof.', year: 2025 },
  { id: 3, name: 'Biniyam Alemu', jobType: 'Admin Staff', evaluation: 'Mid-Year', position: 'Coordinator', year: 2025 }
];

export default function SelfEvaluation() {
  const [taskData, setTaskData] = useState(taskDatas);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });
  const [total, setTotal] = useState(0);
  const [totalRank, setTotalRank] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeChange = (e) => {
    const empId = parseInt(e.target.value);
    const employee = employees.find(emp => emp.id === empId);
    setSelectedEmployee(employee || null);
    setTaskData(taskDatas); // reset tasks when new employee selected
    setTotal(0);
    setTotalRank(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setMessage('Please select an employee first!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMessage(`Evaluation for ${selectedEmployee.name} submitted successfully!`);
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

        {/* Header */}
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
          {/* Employee selection */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Select Employee</label>
            <select
              onChange={handleEmployeeChange}
              value={selectedEmployee?.id || ''}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee info */}
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

          {/* Evaluation table */}
          {selectedEmployee && (
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
          )}

          {/* Totals */}
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

          {/* Message */}
          {message && <p className="text-center text-green-600 font-medium">{message}</p>}

          {/* Submit */}
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
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { taskDatas } from '@/components/forms/tasks';

// Temporary static employees list (replace with API/DB fetch)
const employees = [
  { id: 1, name: 'Famo Doje', jobType: 'Instructor', evaluation: 'Mid-Year', position: 'Lecturer', year: 2025 },
  { id: 2, name: 'Selam Abebe', jobType: 'Researcher', evaluation: 'End-Year', position: 'Assistant Prof.', year: 2025 },
  { id: 3, name: 'Biniyam Alemu', jobType: 'Admin Staff', evaluation: 'Mid-Year', position: 'Coordinator', year: 2025 }
];

export default function SelfEvaluation() {
  const [taskData, setTaskData] = useState(taskDatas);
  const [newTask, setNewTask] = useState({ name: '', weight: '', rank: 0 });
  const [total, setTotal] = useState(0);
  const [totalRank, setTotalRank] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeChange = (e) => {
    const empId = parseInt(e.target.value);
    const employee = employees.find(emp => emp.id === empId);
    setSelectedEmployee(employee || null);
    setTaskData(taskDatas); // reset tasks when new employee selected
    setTotal(0);
    setTotalRank(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setMessage('Please select an employee first!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMessage(`Evaluation for ${selectedEmployee.name} submitted successfully!`);
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

        {/* Header */}
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
          {/* Employee selection */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Select Employee</label>
            <select
              onChange={handleEmployeeChange}
              value={selectedEmployee?.id || ''}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee info */}
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

          {/* Evaluation table */}
          {selectedEmployee && (
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
          )}

          {/* Totals */}
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

          {/* Message */}
          {message && <p className="text-center text-green-600 font-medium">{message}</p>}

          {/* Submit */}
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
