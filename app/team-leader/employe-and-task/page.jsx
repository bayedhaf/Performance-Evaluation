'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeTaskSelector() {
  const router = useRouter();

  const [employee, setEmployee] = useState('');
  const [taskType, setTaskType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employee && taskType) {
      router.push(`/dashboard?employee=${employee}&task=${taskType}`);
    } else {
      alert('Please select both employee and task type');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="flex flex-row items-center justify-around gap-4 mb-4">
        <select
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          required
          className="bg-[#8D92EB] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="" disabled>
            Select the employee name
          </option>
          <option value="emp1">Employee 1</option>
          <option value="emp2">Employee 2</option>
          <option value="emp3">Employee 3</option>
        </select>

        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          required
          className="bg-[#8D92EB] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="" disabled>
            Select Task Type
          </option>
          <option value="out-of-70">Out of 70</option>
          <option value="out-of-10">Out of 10</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-[#8D92EB]  text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Continue
      </button>
    </form>
  );
}
