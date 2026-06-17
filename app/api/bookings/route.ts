import { NextResponse } from 'next/server'
import { getBookings, addBooking, updateBookingStatus } from '@/lib/db'

export async function GET() {
  try {
    const bookings = await getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, courseName, instructor, date, timeSlot, batchTiming, studentName, studentEmail, amount } = body

    if (!courseId || !courseName || !date || !timeSlot || !batchTiming || !studentName || !studentEmail) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const id = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const booking = {
      id,
      courseId,
      courseName,
      instructor: instructor || 'Ajinkya Amrule',
      date,
      timeSlot,
      batchTiming,
      studentName,
      studentEmail,
      status: 'Booked' as const,
      createdAt: new Date().toISOString(),
      amount: amount ? Number(amount) : undefined
    }

    const success = await addBooking(booking)
    if (success) {
      return NextResponse.json({ success: true, booking })
    } else {
      return NextResponse.json({ error: 'Failed to add booking' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process booking request' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing booking ID or status' }, { status: 400 })
    }

    if (status !== 'Booked' && status !== 'Pending' && status !== 'Cancelled') {
      return NextResponse.json({ error: 'Invalid booking status value' }, { status: 400 })
    }

    const success = await updateBookingStatus(id, status)
    if (success) {
      return NextResponse.json({ success: true, message: `Status updated to ${status}` })
    } else {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 })
  }
}
