'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { ClassSchedule, TimeSlot, addBooking, generateBookingId } from '@/data/bookingData'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  classSchedule: ClassSchedule
  onBookingSuccess: (booking: any) => void
}

export default function BookingModal({ isOpen, onClose, classSchedule, onBookingSuccess }: BookingModalProps) {
  const { theme } = useTheme()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDates = [
    '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20',
    '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25',
    '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30'
  ]

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !studentName || !studentEmail) {
      alert('Please fill all fields')
      return
    }

    setIsSubmitting(true)

    // Create booking
    const booking = {
      id: generateBookingId(),
      courseName: classSchedule.name,
      instructor: classSchedule.instructor,
      date: selectedDate,
      timeSlot: selectedSlot.time,
      studentName,
      studentEmail,
      status: 'Booked' as const,
      createdAt: new Date().toISOString()
    }

    try {
      // Add booking to storage
      addBooking(booking)
      
      // Update slot availability
      selectedSlot.available = false
      selectedSlot.studentName = studentName
      selectedSlot.studentEmail = studentEmail
      selectedSlot.bookingId = booking.id

      // Show success
      onBookingSuccess(booking)
      onClose()
      
      // Reset form
      setSelectedDate('')
      setSelectedSlot(null)
      setStudentName('')
      setStudentEmail('')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Book Your Class
            </h2>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className={`mt-4 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {classSchedule.name}
            </h3>
            <div className={`grid grid-cols-2 gap-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div>
                <span className="font-medium">Instructor:</span> {classSchedule.instructor}
              </div>
              <div>
                <span className="font-medium">Level:</span> {classSchedule.level}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Time:</span> {classSchedule.time}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Days:</span> {classSchedule.days.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Choose a date</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Time Slot
            </label>
            <div className="grid grid-cols-3 gap-3">
              {classSchedule.timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl font-medium transition-all ${
                    !slot.available
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : selectedSlot?.id === slot.id
                      ? 'bg-indigo-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {slot.time}
                  {!slot.available && (
                    <div className="text-xs mt-1">Booked</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Email
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Booking Button */}
          <button
            onClick={handleBooking}
            disabled={isSubmitting || !selectedDate || !selectedSlot || !studentName || !studentEmail}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isSubmitting || !selectedDate || !selectedSlot || !studentName || !studentEmail
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Booking...' : 'Book This Class'}
          </button>
        </div>
      </div>
    </div>
  )
}
