'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../shared/navbar/Navbar'

export default function EditUserForm({ userId }) {
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/employee/profile');
        if (res.ok) {
          const data = await res.json();
          const userData = data.user;
          setForm({
            fullName: userData.fullName || '',
            gender: userData.gender || '',
            dob: userData.dob || '',
            email: userData.email || '',
            password: '',
            phone: userData.phone || '',
            country: userData.country || '',
            region: userData.region || '',
            photo: null,
            position: userData.position || '',
            level: userData.level || '',
            experience: userData.experience || '',
            field: userData.field || '',
            department: userData.department || '',
            instName: userData.instName || '',
            emgName: userData.emgName || '',
            emgRelation: userData.emgRelation || '',
            emgContact: userData.emgContact || '',
            emgJob: userData.emgJob || '',
          });
        } else {
          setMessage('❌ Failed to fetch user details.');
        }
      } catch (err) {
        setMessage('❌ Error: ' + err.message);
      }
    }
    fetchUser();
  }, [])

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
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await fetch('/api/employee/profile', {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setMessage('✅ ' + (data.message || 'User updated successfully!'));
      } else {
        const errorData = await res.json();
        setMessage('❌ ' + (errorData.error || 'Failed to update user.'));
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center px-0 py-0 font-sans">
      <Navbar className="fixed top-0 left-0 w-full z-50" />

      <header className="w-full mt-20 max-w-4xl mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
          ASTU Employee Portal
        </h1>
        <p className="text-gray-500 mt-2">Update your employee details below</p>
      </header>

    
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md transition 
                ${step >= s ? 'bg-indigo-600 scale-105' : 'bg-gray-300'}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition ${
                  step > s ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

   
      <form
        onSubmit={handleSubmit}
        className="w-full mb-48 max-w-3xl bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-100"
        encType="multipart/form-data"
        
      >
        {step === 1 && (
          <fieldset className="space-y-6">
            <legend className="font-semibold text-lg text-gray-800 mb-4">
              Personal Information
            </legend>
            {[
              { label: 'Full Name', name: 'fullName', type: 'text' },
              { label: 'Date of Birth', name: 'dob', type: 'date' },
              { label: 'Email Address', name: 'email', type: 'email' },
              { label: 'Password (leave blank if unchanged)', name: 'password', type: 'password' },
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
                  className="mt-1 px-4 py-3 w-full border border-gray-200 rounded-xl bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  required={field.name !== 'password'}
                />
              </label>
            ))}

            <label className="block">
              <span className="font-medium text-gray-700">Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 px-4 py-3 w-full border border-gray-200 rounded-xl bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                required
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block">
              <span className="font-medium text-gray-700">Update Photo</span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full text-sm text-gray-600 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </label>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-6">
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
                  className="mt-1 px-4 py-3 w-full border border-gray-200 rounded-xl bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  required
                />
              </label>
            ))}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-6">
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
                  className="mt-1 px-4 py-3 w-full border border-gray-200 rounded-xl bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  required
                />
              </label>
            ))}
          </fieldset>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition shadow-sm"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
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
