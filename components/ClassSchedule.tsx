'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { generateClassSchedules, getBookings, addBooking, generateBookingId } from '@/data/bookingData'
import BookingModal from './BookingModal'
import BookingSuccess from './BookingSuccess'

interface ClassScheduleProps {
  onClassSelect?: (classId: string) => void
}

export default function ClassSchedule({ onClassSelect }: ClassScheduleProps) {
  const { theme } = useTheme()
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    fetch('/api/schedules')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s: any) => {
            let level = 'All Levels'
            let days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            if (s.id.toLowerCase().includes('morning') || s.name.toLowerCase().includes('morning')) {
              level = 'Beginner to Advanced'
            } else if (s.id.toLowerCase().includes('vocal')) {
              level = 'Beginner to Intermediate'
            }
            return {
              id: s.id === 'morning' ? 'morning-piano' : (s.id === 'evening' ? 'evening-guitar' : s.id),
              name: s.name,
              time: `${s.startTime} - ${s.endTime}`,
              days: days,
              instructor: 'Ajinkya Amrule',
              level: level,
              timeSlots: s.timeSlots.map((ts: string, idx: number) => ({ id: `${s.id}-${idx}`, time: ts, available: true }))
            }
          })
          setScheduleData(mapped)
        } else {
          setScheduleData(generateClassSchedules())
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching schedules:', err)
        setScheduleData(generateClassSchedules())
        setLoading(false)
      })
  }, [])

  const handleBookClass = (classItem: any) => {
    setSelectedClass(classItem)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = (newBooking: any) => {
    setBooking(newBooking)
    setShowBookingModal(false)
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setBooking(null)
  }

  return (
    <section id="schedule" className={`py-16 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full"></div>
      
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>Class Schedule</h2>
        <p className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 px-3.5 py-1.5 rounded-full font-bold text-sm shadow-sm">
            Monday: Closed
          </span>
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleData.map((classItem) => (
            <div
              key={classItem.id}
              className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>{classItem.name}</h3>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{classItem.time}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Days:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {classItem.days.map((day) => (
                      <span
                        key={day}
                        className={`px-2 py-1 rounded text-xs ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Instructor:</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{classItem.instructor}</p>
                </div>
                
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Level:</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{classItem.level}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleBookClass(classItem)}
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105"
              >
                Book This Class
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        classSchedule={selectedClass}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Success Modal */}
      <BookingSuccess
        isOpen={showSuccess}
        booking={booking}
        onClose={handleSuccessClose}
      />
    </section>
  )
}
