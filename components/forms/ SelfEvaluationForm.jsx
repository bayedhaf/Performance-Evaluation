'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function SelfEvaluationForm() {
  const [year] = useState(new Date().getFullYear());
  const [typeOfWork, setTypeOfWork] = useState('');
  const [rank, setRank] = useState('');
  const [tasks, setTasks] = useState([{ no: '', task: '', score: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { no: '', task: '', score: '' }]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const formData = { typeOfWork, rank, year, tasks };

    try {
      const res = await fetch('/api/self-evaluation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage('Form submitted successfully!');
        setTypeOfWork('');
        setRank('');
        setTasks([{ no: '', task: '', score: '' }]);
      } else {
        setMessage('Failed to submit form.');
      }
    } catch (err) {
      setMessage('Error submitting form.');
    }
    setLoading(false);
  };

  return (
    <div className="px-4 py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="flex flex-col items-center text-center space-y-4">
        <Image
          src="/image/astuLogo.png"
          alt="ASTU Logo"
          width={100}
          height={100}
          className="rounded-full shadow-xl border border-gray-300"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          Adama Science And Technology University
        </h1>
        <p className="text-sm text-gray-600 max-w-lg">
          Self Evaluation Form for Behavioral and Task (5%)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-48 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <label className="flex flex-col text-sm font-semibold w-full">
            Type of Work Evaluation
            <input
              type="text"
              value={typeOfWork}
              onChange={(e) => setTypeOfWork(e.target.value)}
              placeholder="Enter type"
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </label>
          <label className="flex flex-col text-sm font-semibold w-full">
            Rank
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="Enter rank"
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </label>
        </div>

        <p className="text-gray-700 font-medium">Year of Evaluation: {year}</p>

        <div className="p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold border-b pb-1 border-gray-300">
            Evaluation <span className="text-green-600 font-bold">5%</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1 w-16">No.</th>
                  <th className="border px-2 py-1">Tasks</th>
                  <th className="border px-2 py-1">Out of (100%)</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-2 py-1 w-16">
                      <input
                        type="number"
                        value={task.no}
                        onChange={(e) =>
                          handleTaskChange(index, 'no', e.target.value)
                        }
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-300"
                        required
                      />
                    </td>
                    <td className="border px-2 py-1 text-left">
                      <input
                        type="text"
                        value={task.task}
                        onChange={(e) =>
                          handleTaskChange(index, 'task', e.target.value)
                        }
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-300"
                        required
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={task.score}
                        onChange={(e) =>
                          handleTaskChange(index, 'score', e.target.value)
                        }
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-300"
                        required
                      />
                    </td>
                    <td className="border px-2 py-1">
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            + Add Task
          </button>
        </div>

        {message && (
          <div className="text-center text-green-600 font-medium">{message}</div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-8 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}