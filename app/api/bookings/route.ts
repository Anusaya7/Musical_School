import { NextResponse } from 'next/server'
import { getBookings, addBooking, updateBookingStatus, addNotification, addAuditLog } from '@/lib/db'
import { sendSystemEmail } from '@/lib/email'

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

    const id = `BK-${Date.now()}`
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
      status: 'Pending' as const, // Start as Pending for admin review
      createdAt: new Date().toISOString(),
      amount: amount ? Number(amount) : undefined
    }

    const success = await addBooking(booking)
    if (success) {
      // Create admin notification
      await addNotification({
        id: `notif-${Date.now()}`,
        title: 'New Booking Request',
        message: `${studentName} requested a demo slot for ${courseName} on ${date} at ${timeSlot}`,
        createdAt: new Date().toISOString(),
        isRead: false
      })

      // Log activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: studentEmail,
        action: 'Booking Request',
        details: `Requested class booking: ${courseName} on ${date} (${timeSlot})`,
        createdAt: new Date().toISOString()
      })

      // Send confirmation email to student
      const studentHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #2563eb;">Booking Request Received</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Your booking request for a trial/demo class has been received successfully.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Course:</strong> ${courseName}</p>
            <p style="margin: 5px 0;"><strong>Instructor:</strong> ${booking.instructor}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${timeSlot} (${batchTiming} batch)</p>
          </div>
          <p>Our administrator will review your request and confirm the slot shortly.</p>
        </div>
      `
      await sendSystemEmail(studentEmail, `Booking Request Received - ${courseName}`, studentHtml)

      // Send email to admin
      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>New Class Booking Request</h2>
          <p>A new trial/demo slot request needs review:</p>
          <ul>
            <li><strong>Student:</strong> ${studentName} (${studentEmail})</li>
            <li><strong>Course:</strong> ${courseName}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time Slot:</strong> ${timeSlot} (${batchTiming})</li>
          </ul>
        </div>
      `
      await sendSystemEmail('aamrule90@gmail.com', 'New Booking Request Alert', adminHtml)

      return NextResponse.json({ success: true, booking })
    } else {
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process booking request' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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

    // 1. Reschedule action handling
    if (date || timeSlot) {
      existing.date = date || existing.date
      existing.timeSlot = timeSlot || existing.timeSlot
      existing.status = 'Pending' // Reset to pending if rescheduled by admin or student
      
      const db = await import('@/lib/db')
      await db.rescheduleBooking(id, existing.date, existing.timeSlot)

      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Booking Rescheduled',
        details: `Rescheduled booking ${id} to ${existing.date} at ${existing.timeSlot}`,
        createdAt: new Date().toISOString()
      })

      // Notify student via email
      const rescheduleHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>Booking Rescheduled Notification</h2>
          <p>Hello <strong>${existing.studentName}</strong>,</p>
          <p>Your class booking for <strong>${existing.courseName}</strong> has been rescheduled:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
            <p><strong>New Date:</strong> ${existing.date}</p>
            <p><strong>New Time Slot:</strong> ${existing.timeSlot}</p>
          </div>
        </div>
      `
      await sendSystemEmail(existing.studentEmail, 'Class Booking Rescheduled', rescheduleHtml)

      return NextResponse.json({ success: true, booking: existing })
    }

    // 2. Status change action handling (Accept, Reject, Cancel)
    if (!status) {
      return NextResponse.json({ error: 'Missing booking status' }, { status: 400 })
    }

    const success = await updateBookingStatus(id, status)
    if (success) {
      // Log audit
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: `Booking ${status}`,
        details: `Updated booking status of ${id} to ${status}`,
        createdAt: new Date().toISOString()
      })

      // Send status update email to student
      const statusHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>Booking Status Update</h2>
          <p>Hello <strong>${existing.studentName}</strong>,</p>
          <p>The status of your trial class booking for <strong>${existing.courseName}</strong> has been updated to: <strong style="color: #2563eb;">${status}</strong>.</p>
          <p>Date: ${existing.date} at ${existing.timeSlot}</p>
        </div>
      `
      await sendSystemEmail(existing.studentEmail, `Booking Status Update - ${status}`, statusHtml)

      return NextResponse.json({ success: true, message: `Status updated to ${status}` })
    } else {
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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
        userEmail: 'admin@2ndinversion.com',
        action: 'Booking Deleted',
        details: `Removed booking record ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Booking removed successfully' })
    }
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
