'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

const SelectContext = createContext(null)

export function Select({ value, onValueChange, children, className = '' }) {
  const [open, setOpen] = useState(false)

  const items = []
  React.Children.forEach(children, (child) => {
    if (child && child.type && child.type.displayName === 'SelectContent') {
      React.Children.forEach(child.props.children, (item) => {
        if (item && item.type && item.type.displayName === 'SelectItem') {
          items.push({ value: item.props.value, label: item.props.children })
        }
      })
    }
  })

  const selectedItem = useMemo(
    () => items.find((i) => i.value === value) || null,
    [items, value]
  )

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, items, selectedItem }}>
      <div className={`relative ${className}`}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = '', ...props }) {
  const { setOpen, selectedItem } = useContext(SelectContext)
  return (
    <button
      type="button"
      className={`flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      onClick={() => setOpen((o) => !o)}
      {...props}
    >
      <span className="truncate">{children || selectedItem?.label || ''}</span>
      <svg className="ml-2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
    </button>
  )
}
SelectTrigger.displayName = 'SelectTrigger'

export function SelectValue({ placeholder = '', className = '' }) {
  const { selectedItem } = useContext(SelectContext)
  return (
    <span className={`truncate ${className}`}>{selectedItem?.label || placeholder}</span>
  )
}
SelectValue.displayName = 'SelectValue'

export function SelectContent({ children, className = '' }) {
  const { open } = useContext(SelectContext)
  if (!open) return null
  return (
    <div className={`absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white p-1 shadow-lg ${className}`}>
      <ul className="max-h-60 overflow-auto text-sm">
        {React.Children.map(children, (child, idx) => (
          <li key={idx}>{child}</li>
        ))}
      </ul>
    </div>
  )
}
SelectContent.displayName = 'SelectContent'

export function SelectItem({ value, children, className = '' }) {
  const { onValueChange, setOpen } = useContext(SelectContext)
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center rounded px-2 py-2 text-left hover:bg-gray-100 ${className}`}
      onClick={() => {
        onValueChange?.(value)
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}
SelectItem.displayName = 'SelectItem'


