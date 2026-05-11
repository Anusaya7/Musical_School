'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface BookingSuccessProps {
  isOpen: boolean
  booking: any
  onClose: () => void
}

export default function BookingSuccess({ isOpen, booking, onClose }: BookingSuccessProps) {
  const { theme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      // Send email confirmation (mock)
      console.log('Sending booking confirmation to:', booking.studentEmail)
      
      // Add to calendar (mock)
      console.log('Adding to calendar:', {
        title: booking.courseName,
        date: booking.date,
        time: booking.timeSlot
      })
    }
  }, [isOpen, booking])

  if (!isOpen) return null

  const handleAddToCalendar = () => {
    // Create calendar event URL
    const event = {
      text: booking.courseName,
      dates: `${booking.date} ${booking.timeSlot}`,
      details: `Instructor: ${booking.instructor}\nStudent: ${booking.studentName}`
    }
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${encodeURIComponent(event.dates)}&details=${encodeURIComponent(event.details)}`
    window.open(calendarUrl, '_blank')
  }

  const handleGoToDashboard = () => {
    onClose()
    // Navigate to dashboard (mock)
    console.log('Navigating to dashboard...')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-md rounded-3xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl p-8 text-center`}>
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Your Class is Booked!
        </h2>
        
        <div className={`p-6 rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Course:
              </span>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {booking.courseName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Instructor:
              </span>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {booking.instructor}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Date:
              </span>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Time:
              </span>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {booking.timeSlot}
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          A confirmation email has been sent to {booking.studentEmail}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCalendar}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Add to Calendar
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Go to Dashboard
          </button>
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
