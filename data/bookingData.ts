export interface TimeSlot {
  id: string
  time: string
  available: boolean
  studentName?: string
  studentEmail?: string
  bookingId?: string
}

export interface ClassSchedule {
  id: string
  name: string
  time: string
  days: string[]
  instructor: string
  level: string
  timeSlots: TimeSlot[]
}

export interface Booking {
  id: string
  courseName: string
  instructor: string
  date: string
  timeSlot: string
  studentName: string
  studentEmail: string
  status: 'Booked' | 'Pending' | 'Cancelled'
  createdAt: string
}

// Generate initial class schedules
export const generateClassSchedules = (): ClassSchedule[] => {
  return [
    {
      id: 'morning-piano',
      name: 'Morning Piano Class',
      time: '3:00 AM - 12:00 PM',
      days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      instructor: 'Ajinkya Amrule',
      level: 'Beginner to Advanced',
      timeSlots: [
        { id: 'piano-4am', time: '4:00 AM', available: true },
        { id: 'piano-5am', time: '5:00 AM', available: true },
        { id: 'piano-6am', time: '6:00 AM', available: true },
        { id: 'piano-7am', time: '7:00 AM', available: true },
        { id: 'piano-8am', time: '8:00 AM', available: true },
        { id: 'piano-9am', time: '9:00 AM', available: true },
        { id: 'piano-10am', time: '10:00 AM', available: true },
        { id: 'piano-11am', time: '11:00 AM', available: true },
        { id: 'piano-12pm', time: '12:00 PM', available: true }
      ]
    },
    {
      id: 'evening-guitar',
      name: 'Evening Guitar Class',
      time: '3:00 PM - 9:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      instructor: 'Ajinkya Amrule',
      level: 'All Levels',
      timeSlots: [
        { id: 'guitar-3pm', time: '3:00 PM', available: true },
        { id: 'guitar-4pm', time: '4:00 PM', available: true },
        { id: 'guitar-5pm', time: '5:00 PM', available: true },
        { id: 'guitar-6pm', time: '6:00 PM', available: true },
        { id: 'guitar-7pm', time: '7:00 PM', available: true },
        { id: 'guitar-8pm', time: '8:00 PM', available: true },
        { id: 'guitar-9pm', time: '9:00 PM', available: true }
      ]
    },
    {
      id: 'vocal-training',
      name: 'Vocal Training',
      time: '3:00 PM - 9:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      instructor: 'Ajinkya Amrule',
      level: 'Beginner to Intermediate',
      timeSlots: [
        { id: 'vocal-3pm', time: '3:00 PM', available: true },
        { id: 'vocal-4pm', time: '4:00 PM', available: true },
        { id: 'vocal-5pm', time: '5:00 PM', available: true },
        { id: 'vocal-6pm', time: '6:00 PM', available: true },
        { id: 'vocal-7pm', time: '7:00 PM', available: true },
        { id: 'vocal-8pm', time: '8:00 PM', available: true },
        { id: 'vocal-9pm', time: '9:00 PM', available: true }
      ]
    }
  ]
}

// Local storage functions
export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return []
  const bookings = localStorage.getItem('bookings')
  return bookings ? JSON.parse(bookings) : []
}

export const saveBookings = (bookings: Booking[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('bookings', JSON.stringify(bookings))
}

export const addBooking = (booking: Booking): void => {
  const bookings = getBookings()
  bookings.push(booking)
  saveBookings(bookings)
}

export const updateBooking = (bookingId: string, updates: Partial<Booking>): void => {
  const bookings = getBookings()
  const index = bookings.findIndex(b => b.id === bookingId)
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates }
    saveBookings(bookings)
  }
}

export const deleteBooking = (bookingId: string): void => {
  const bookings = getBookings()
  const filteredBookings = bookings.filter(b => b.id !== bookingId)
  saveBookings(filteredBookings)
}

// Time slot management
export const updateTimeSlotAvailability = (
  classId: string,
  slotId: string,
  available: boolean,
  studentName?: string,
  studentEmail?: string,
  bookingId?: string
): void => {
  const schedules = generateClassSchedules()
  const schedule = schedules.find(s => s.id === classId)
  if (schedule) {
    const slot = schedule.timeSlots.find(s => s.id === slotId)
    if (slot) {
      slot.available = available
      slot.studentName = studentName
      slot.studentEmail = studentEmail
      slot.bookingId = bookingId
    }
  }
}

export const checkSlotAvailability = (classId: string, slotId: string): boolean => {
  const schedules = generateClassSchedules()
  const schedule = schedules.find(s => s.id === classId)
  if (schedule) {
    const slot = schedule.timeSlots.find(s => s.id === slotId)
    return slot ? slot.available : false
  }
  return false
}

export const getAvailableDates = (): string[] => {
  const dates = []
  const today = new Date()
  
  // Generate dates for next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // Skip Mondays (holiday)
    if (date.getDay() !== 1) {
      dates.push(date.toISOString().split('T')[0])
    }
  }
  
  return dates
}

export const getClassScheduleById = (id: string): ClassSchedule | undefined => {
  const schedules = generateClassSchedules()
  return schedules.find(s => s.id === id)
}

export const generateBookingId = (): string => {
  return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
