'use client'

import React, { useState } from 'react'

export default function NewUserCreationForms() {
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    dob: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    region: '',
    photo: null,
    position: '',
    level: '',
    experience: '',
    field: '',
    department: '',
    instName: '',
    emgName: '',
    emgRelation: '',
    emgContact: '',
    emgJob: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target 
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      const res = await fetch('/api/new-user', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setMessage('✅ User registered successfully!')
        setForm({
          fullName: '',
          gender: '',
          dob: '',
          email: '',
          password: '',
          phone: '',
          country: '',
          region: '',
          photo: null,
          position: '',
          level: '',
          experience: '',
          field: '',
          department: '',
          instName: '',
          emgName: '',
          emgRelation: '',
          emgContact: '',
          emgJob: '',
        })
      } else {
        setMessage('❌ Failed to register user.')
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-10 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-5xl mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full rounded-2xl p-8 text-center shadow-xl">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">ASTU Employee Portal</h1>
          <p className="text-lg font-medium text-indigo-100 mt-2">Employee Registration Form</p>
        </div>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white p-10 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl shadow-2xl border border-indigo-100"
        encType="multipart/form-data"
      >
        {/* Personal Info */}
        <fieldset className="space-y-5 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
          <legend className="font-semibold text-indigo-700 text-lg">Personal Information</legend>
          {[
            { label: 'Full Name', name: 'fullName', type: 'text' },
            { label: 'Date of Birth', name: 'dob', type: 'date' },
            { label: 'Email Address', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Phone No.', name: 'phone', type: 'tel' },
            { label: 'Country', name: 'country', type: 'text' },
            { label: 'Region/State', name: 'region', type: 'text' },
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="font-medium text-gray-700">{field.label}</span>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </label>
          ))}

          {/* Gender */}
          <label className="block">
            <span className="font-medium text-gray-700">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>

          {/* Photo */}
          <label className="block">
            <span className="font-medium text-gray-700">Photo</span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
            />
          </label>
        </fieldset>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Education */}
          <fieldset className="space-y-5 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
            <legend className="font-semibold text-indigo-700 text-lg">Education Background</legend>
            {[
              { label: 'Position', name: 'position' },
              { label: 'Level', name: 'level' },
              { label: 'Experience', name: 'experience' },
              { label: 'Field of Study', name: 'field' },
              { label: 'Department', name: 'department' },
              { label: 'Institution Name', name: 'instName' },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="font-medium text-gray-700">{field.label}</span>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                />
              </label>
            ))}
          </fieldset>

          {/* Emergency Contact */}
          <fieldset className="space-y-5 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
            <legend className="font-semibold text-indigo-700 text-lg">Emergency Contact Info</legend>
            {[
              { label: 'Full Name', name: 'emgName' },
              { label: 'Relation', name: 'emgRelation' },
              { label: 'Email/Phone', name: 'emgContact' },
              { label: 'Job', name: 'emgJob' },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="font-medium text-gray-700">{field.label}</span>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                />
              </label>
            ))}
          </fieldset>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
