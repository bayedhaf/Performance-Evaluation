import React from 'react'

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
      {...props}
    />
  )
}


