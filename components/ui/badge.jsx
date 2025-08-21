import React from 'react'

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-indigo-100 text-indigo-800',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
    destructive: 'bg-red-100 text-red-800',
  }

  const base = 'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium'
  const cls = `${base} ${variants[variant] || variants.default} ${className}`

  return <span className={cls}>{children}</span>
}


