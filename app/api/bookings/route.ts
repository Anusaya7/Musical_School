import { NextRequest, NextResponse } from 'next/server'
import { getBookings, addAuditLog } from '@/lib/db'
import { BookingService } from '@/lib/services/booking'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  const userEmail = session.user.email?.toLowerCase()

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const bookings = await getBookings()
      const booking = bookings.find(b => b.id === id)
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }
      if (role === 'STUDENT' && booking.studentEmail?.toLowerCase() !== userEmail) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json(booking)
    }

    const bookings = await getBookings()
    if (role === 'STUDENT') {
      const studentBookings = bookings.filter(b => b.studentEmail?.toLowerCase() === userEmail)
      return NextResponse.json(studentBookings)
    }
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 550 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, courseName, instructor, date, timeSlot, batchTiming, studentName, studentEmail, amount } = body

    if (!courseId || !courseName || !date || !timeSlot || !batchTiming || !studentName || !studentEmail) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const booking = await BookingService.createPendingBooking({
      courseId,
      courseName,
      instructor: instructor || 'Ajinkya Amrule',
      date,
      timeSlot,
      batchTiming,
      studentName,
      studentEmail,
      amount: amount ? Number(amount) : undefined
    })

    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    console.error('Failed to create booking request:', error)
    return NextResponse.json({ error: error.message || 'Failed to process booking request' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  const userEmail = session.user.email?.toLowerCase()

  try {
    const body = await request.json()
    const { id, status, date, timeSlot } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    const bookings = await getBookings()
    const existing = bookings.find(b => b.id === id)
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN'
    const isOwner = existing.studentEmail?.toLowerCase() === userEmail

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 1. Reschedule action handling
    if (date || timeSlot) {
      const db = await import('@/lib/db')
      await db.rescheduleBooking(id, date || existing.date, timeSlot || existing.timeSlot)

      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: session.user.email || 'admin@2ndinversion.com',
        action: 'Booking Rescheduled',
        details: `Rescheduled booking ${id} to ${date || existing.date} at ${timeSlot || existing.timeSlot}`,
        createdAt: new Date().toISOString()
      })

      return NextResponse.json({ success: true, message: 'Rescheduled successfully' })
    }

    // 2. Status change action handling (Approved, Rejected, Pending)
    if (status) {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden: Only administrators can update booking status' }, { status: 403 })
      }

      let targetStatus: 'Approved' | 'Rejected' | 'Pending' = 'Pending'
      if (status === 'Approved' || status === 'Booked') {
        targetStatus = 'Approved'
      } else if (status === 'Rejected' || status === 'Cancelled') {
        targetStatus = 'Rejected'
      }

      await BookingService.updateStatus(id, targetStatus)
      return NextResponse.json({ success: true, message: `Status updated to ${targetStatus}` })
    }

    return NextResponse.json({ error: 'No update parameters provided' }, { status: 400 })
  } catch (error: any) {
    console.error('Failed to update booking status:', error)
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 550 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    const db = await import('@/lib/db')
    const success = await db.deleteBooking(id)

    if (success) {
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: session.user.email || 'admin@2ndinversion.com',
        action: 'Booking Deleted',
        details: `Removed booking record ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Booking removed successfully' })
    }
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 550 })
  }
}
