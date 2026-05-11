'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getBookings, updateBooking, deleteBooking } from '@/data/bookingData'

export default function AdminBookings() {
  const { theme } = useTheme()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
    setLoading(false)
  }, [])

  const handleApprove = (bookingId: string) => {
    updateBooking(bookingId, { status: 'Booked' })
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'Booked' } : b
    ))
  }

  const handleCancel = (bookingId: string) => {
    updateBooking(bookingId, { status: 'Cancelled' })
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    ))
  }

  const handleDelete = (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(bookingId)
      setBookings(prev => prev.filter(b => b.id !== bookingId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          All Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Student Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Course
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Instructor
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Time
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {bookings.map((booking) => (
                  <tr key={booking.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {booking.studentName}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.courseName}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.instructor}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.timeSlot}
                    </td>
                    <td className={`px-6 py-4`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4`}>
                      <div className="flex gap-2">
                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                        {(booking.status === 'Booked' || booking.status === 'Pending') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
