'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Calendar, Clock, User, Mail, X, CreditCard, Smartphone, Building, DollarSign } from 'lucide-react'

interface CourseBookingProps {
  course: {
    id: string
    title: string
    instructor: string
    price: number
    category: string
  }
  onBookingComplete: (booking: any) => void
}

export default function CourseBooking({ course, onBookingComplete }: CourseBookingProps) {
  const { theme } = useTheme()
  const [showTimeSlots, setShowTimeSlots] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  // Generate available dates for the next 15 days
  const availableDates = Array.from({ length: 15 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  // Time slots based on course category
  const getTimeSlots = () => {
    const baseSlots = [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM',
      '05:00 PM - 06:00 PM',
      '06:00 PM - 07:00 PM'
    ]

    // Add specific slots based on course category
    const categorySpecificSlots = {
      'piano': [...baseSlots, '07:00 PM - 08:00 PM'],
      'guitar': [...baseSlots, '08:00 PM - 09:00 PM'],
      'drums': [...baseSlots.slice(0, 6)], // Drums limited to daytime
      'vocals': [...baseSlots, '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM'],
      'violin': [...baseSlots, '07:00 PM - 08:00 PM'],
      'music-theory': [...baseSlots],
      'bass-guitar': [...baseSlots, '08:00 PM - 09:00 PM'],
      'saxophone': [...baseSlots, '07:00 PM - 08:00 PM']
    }

    return categorySpecificSlots[course.category as keyof typeof categorySpecificSlots] || baseSlots
  }

  const timeSlots = getTimeSlots()

  const handleBookTimeSlot = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot')
      return
    }
    setShowPayment(true)
  }

  const handlePayment = () => {
    if (!studentName || !studentEmail) {
      alert('Please fill in your details')
      return
    }
    setShowPaymentOptions(true)
  }

  const processPayment = async (paymentMethod: string) => {
    setIsBooking(true)

    try {
      const booking = {
        id: `${course.id}-${Date.now()}`,
        courseId: course.id,
        courseName: course.title,
        instructor: course.instructor,
        category: course.category,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        studentName,
        studentEmail,
        paymentMethod,
        amount: course.price,
        status: 'Booked',
        createdAt: new Date().toISOString()
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      onBookingComplete(booking)
      
      // Show success message
      alert(`Payment successful via ${paymentMethod}! Booking confirmed for ${course.title}. You will receive a confirmation email.`)
      
      // Reset form
      setShowPaymentOptions(false)
      setShowPayment(false)
      setShowTimeSlots(false)
      setSelectedDate('')
      setSelectedTimeSlot('')
      setStudentName('')
      setStudentEmail('')
      
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Book Time Slot Button */}
      <button
        onClick={() => setShowTimeSlots(true)}
        className="w-full px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
      >
        Book Time Slot
      </button>

      {/* Time Slots Modal */}
      {showTimeSlots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            {/* Close Button */}
            <button
              onClick={() => setShowTimeSlots(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 space-y-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Book Time Slot
                </h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {course.title} with {course.instructor}
                </p>
              </div>

              {/* Date Selection */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-600">
                <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-full px-4 py-4 rounded-xl border-2 font-bold text-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-yellow-500 text-yellow-300' 
                      : 'bg-white border-yellow-400 text-gray-900'
                  } focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-600`}
                >
                  <option value="" className="text-gray-600 dark:text-gray-400 font-medium">
                    --- Select a date for booking ---
                  </option>
                  {availableDates.map(date => (
                    <option key={date} value={date} className="font-medium">
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
                <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${
                        selectedTimeSlot === slot
                          ? theme === 'dark'
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-blue-100 border-blue-500 text-blue-900'
                          : theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-lg font-bold mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-green-500 text-white' 
                        : 'bg-white border-green-400 text-gray-900'
                    } focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-600`}
                  />
                </div>
                <div>
                  <label className={`block text-lg font-bold mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-green-500 text-white' 
                        : 'bg-white border-green-400 text-gray-900'
                    } focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-600`}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTimeSlots(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookTimeSlot}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    !selectedDate || !selectedTimeSlot
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg'
                  }`}
                >
                  {!selectedDate || !selectedTimeSlot ? 'Please select date and time' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}>
            <div className="p-6 space-y-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Confirm Booking
                </h2>
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Course:</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{course.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Date:</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Time:</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Amount:</span>
                      <span className={`font-bold text-green-600`}>Rs. {course.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isBooking || !studentName || !studentEmail}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    isBooking || !studentName || !studentEmail
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {isBooking ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Options Modal */}
      {showPaymentOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}>
            <button
              onClick={() => setShowPaymentOptions(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 space-y-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Select Payment Method
                </h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose your preferred payment method
                </p>
              </div>

              <div className="space-y-3">
                {/* Credit/Debit Card */}
                <button
                  onClick={() => processPayment('Credit/Debit Card')}
                  disabled={isBooking}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
                      : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  } ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-blue-100'
                    }`}>
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Credit/Debit Card
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Visa, Mastercard, RuPay
                      </div>
                    </div>
                  </div>
                </button>

                {/* UPI */}
                <button
                  onClick={() => processPayment('UPI')}
                  disabled={isBooking}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-green-500 hover:bg-gray-600'
                      : 'bg-white border-gray-200 hover:border-green-500 hover:bg-green-50'
                  } ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-green-100'
                    }`}>
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        UPI
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        PhonePe, GPay, Paytm
                      </div>
                    </div>
                  </div>
                </button>

                {/* Net Banking */}
                <button
                  onClick={() => processPayment('Net Banking')}
                  disabled={isBooking}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500 hover:bg-gray-600'
                      : 'bg-white border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                  } ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-purple-100'
                    }`}>
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Net Banking
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        All major banks supported
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  disabled={isBooking}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
