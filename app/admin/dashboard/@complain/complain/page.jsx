'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'

export default function EmployeeComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    department: '',
    email: '',
    complaint: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  
  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.'
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required.'
    if (!formData.department.trim()) newErrors.department = 'Department is required.'
    if (!formData.email.trim()) newErrors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.'
    if (!formData.complaint.trim()) newErrors.complaint = 'Please describe your complaint.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
   
      setSubmitted(true)
      setFormData({ fullName: '', employeeId: '', department: '', email: '', complaint: '' })
      setErrors({})
    }
  }

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">Employee Complaint Form</h2>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Complaint submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        <label className="block mb-2 font-medium" htmlFor="fullName">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full p-2 mb-2 border rounded ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Your full name"
        />
        {errors.fullName && <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>}

  
        <label className="block mb-2 font-medium" htmlFor="employeeId">
          Employee ID
        </label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className={`w-full p-2 mb-2 border rounded ${
            errors.employeeId ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Your employee ID"
        />
        {errors.employeeId && <p className="text-red-500 text-sm mb-2">{errors.employeeId}</p>}

       
        <label className="block mb-2 font-medium" htmlFor="department">
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`w-full p-2 mb-2 border rounded ${
            errors.department ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Your department"
        />
        {errors.department && <p className="text-red-500 text-sm mb-2">{errors.department}</p>}

        <label className="block mb-2 font-medium" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 mb-2 border rounded ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

       
        <label className="block mb-2 font-medium" htmlFor="complaint">
          Complaint Details
        </label>
        <textarea
          id="complaint"
          name="complaint"
          value={formData.complaint}
          onChange={handleChange}
          rows={5}
          className={`w-full p-2 mb-4 border rounded resize-none ${
            errors.complaint ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          placeholder="Please describe your complaint here..."
        />
        {errors.complaint && <p className="text-red-500 text-sm mb-2">{errors.complaint}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>
    </Card>
  )
}
