'use client'

import React, { useState } from 'react'

export default function NewUserCreationForms() {
  const [step, setStep] = useState(1)
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

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
        setStep(1)
      } else {
        setMessage('❌ Failed to register user.')
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-6 py-10 font-sans">
    
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800 drop-shadow-sm">ASTU Employee Portal</h1>
        <p className="text-gray-500 mt-2">Employee Registration Form</p>
      </header>

   
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                ${step >= s ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  step > s ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

   
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        encType="multipart/form-data"
      >
      
        {step === 1 && (
          <fieldset className="space-y-5">
            <legend className="font-semibold text-lg text-gray-800 mb-4">
              Personal Information
            </legend>
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
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </label>
            ))}
            
            <label className="block">
              <span className="font-medium text-gray-700">Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                required
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          
            <label className="block">
              <span className="font-medium text-gray-700">Photo</span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full text-sm text-gray-600 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </label>
          </fieldset>
        )}

       
        {step === 2 && (
          <fieldset className="space-y-5">
            <legend className="font-semibold text-lg text-gray-800 mb-4">
              Education Background
            </legend>
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
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </label>
            ))}
          </fieldset>
        )}

     
        {step === 3 && (
          <fieldset className="space-y-5">
            <legend className="font-semibold text-lg text-gray-800 mb-4">
              Emergency Contact Info
            </legend>
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
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </label>
            ))}
          </fieldset>
        )}

      
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-indigo-4 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-300 text-white rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>

      
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
