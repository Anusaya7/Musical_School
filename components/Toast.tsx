'use client'

import { useEffect, useState } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export default function Toast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Global function to show toast
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = Date.now()
      const newToast: Toast = { id, message, type }
      
      setToasts(prev => [...prev, newToast])
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, 3000)
    }

    // Attach to window object
    ;(window as any).showToast = showToast

    return () => {
      delete (window as any).showToast
    }
  }, [])

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-[250px] animate-pulse`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
