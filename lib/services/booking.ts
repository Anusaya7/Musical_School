import { prisma } from '@/lib/prisma'
import { 
  sendSystemEmail, 
  getTrialBookingConfirmationEmail, 
  getCourseBookingConfirmationEmail, 
  getAdminNewTrialBookingEmail, 
  getAdminNewCourseBookingEmail,
  getBookingApprovedEmail,
  getBookingRejectedEmail
} from '@/lib/email'
import { WhatsAppService } from '@/lib/services/whatsapp'

export interface CreateBookingParams {
  courseId: string
  courseName: string
  instructor: string
  date: string
  timeSlot: string
  batchTiming: string
  studentName: string
  studentEmail: string
  amount?: number
}

/**
 * Service to handle Course Bookings.
 */
export class BookingService {
  /**
   * Directly creates a course booking without payment (marked as Pending).
   */
  static async createPendingBooking(params: CreateBookingParams) {
    const {
      courseId,
      courseName,
      instructor,
      date,
      timeSlot,
      batchTiming,
      studentName,
      studentEmail,
      amount
    } = params

    const bookingId = `BK-${Date.now()}`
    let booking: any = null
    let studentPhone: string | null = null

    try {
      console.log(`[BookingService] Starting database transaction to create booking ${bookingId}`)
      const transactionResult = await prisma.$transaction(async (tx) => {
        // Check for duplicate booking
        const existing = await tx.booking.findFirst({
          where: {
            studentEmail: studentEmail.toLowerCase(),
            courseId,
            date,
            timeSlot,
            status: { in: ['Pending', 'Approved', 'Booked'] }
          }
        })
        if (existing) {
          throw new Error('Duplicate booking: You have already booked a class for this course at this date and time slot.')
        }

        // 1. Create the booking record as Pending
        const b = await tx.booking.create({
          data: {
            id: bookingId,
            courseId,
            courseName,
            instructor,
            date,
            timeSlot,
            batchTiming,
            studentName,
            studentEmail,
            status: 'Pending',
            amount: amount || null,
            studentId: studentEmail
          }
        })

        // 2. Create Admin Notification
        await tx.notification.create({
          data: {
            title: amount && amount > 0 ? 'New Course Booking' : 'New Trial Booking',
            message: `${studentName} booked ${courseName}.`
          }
        })

        // 3. Log Audit
        await tx.auditLog.create({
          data: {
            userEmail: studentEmail,
            action: 'Booking Created',
            details: `${studentName} booked ${courseName} for slot ${date} at ${timeSlot} (Pending Approval)`
          }
        })

        // Fetch student phone number
        const studentRecord = await tx.student.findUnique({
          where: { email: studentEmail.toLowerCase() }
        })

        return {
          booking: b,
          studentPhone: studentRecord?.phone || null
        }
      })
      booking = transactionResult.booking
      studentPhone = transactionResult.studentPhone
      console.log(`[BookingService] Database transaction successfully committed for booking ${bookingId}`)
    } catch (dbError: any) {
      console.error(`[BookingService] Database transaction failed to create booking ${bookingId}:`, dbError)
      throw new Error(`Database transaction failed: ${dbError.message || dbError}`)
    }

    // 4. Send emails asynchronously AFTER transaction has committed successfully
    if (booking) {
      const isTrial = !amount || amount === 0

      const studentEmailHtml = isTrial 
        ? getTrialBookingConfirmationEmail(studentName, courseName, date, timeSlot)
        : getCourseBookingConfirmationEmail(studentName, courseName, date, timeSlot, batchTiming)

      sendSystemEmail(
        studentEmail,
        isTrial ? 'Trial Class Booking Received' : 'Course Booking Received',
        studentEmailHtml
      )
        .then(() => console.log(`[BookingService] Student confirmation email successfully sent to ${studentEmail}`))
        .catch(err => console.error('[BookingService] Failed to send student booking confirmation email:', err))

      const adminEmailHtml = isTrial
        ? getAdminNewTrialBookingEmail(studentName, studentEmail, courseName, date, timeSlot)
        : getAdminNewCourseBookingEmail(studentName, studentEmail, courseName, date, timeSlot, batchTiming)

      sendSystemEmail(
        'aamrule90@gmail.com',
        isTrial ? 'New Trial Booking Request' : 'New Course Booking Request',
        adminEmailHtml
      )
        .then(() => console.log(`[BookingService] Admin alert email successfully sent to aamrule90@gmail.com`))
        .catch(err => console.error('[BookingService] Failed to send admin booking alert email:', err))

      // 5. Send WhatsApp Alerts
      WhatsAppService.sendMessage('917768838832', `Hello Admin, a new ${isTrial ? 'Trial' : 'Course'} Booking Request has been received:
Student: ${studentName} (${studentEmail})
Course: ${courseName}
Date: ${date}
Slot: ${timeSlot} (${batchTiming})
Please approve or reject this booking from the Admin Panel.`)
        .catch(err => console.error('[BookingService] Failed to send admin WhatsApp booking notify:', err))

      if (studentPhone) {
        WhatsAppService.sendMessage(studentPhone, `Hello ${studentName}, we've received your booking request for ${courseName} on ${date} at ${timeSlot} (${batchTiming}).
Your request is currently Pending Approval. We will notify you once it's confirmed!`)
          .catch(err => console.error('[BookingService] Failed to send student WhatsApp booking notify:', err))
      }
    }

    return booking;
  }

  /**
   * Updates booking status (Approved / Rejected) and notifies student.
   */
  static async updateStatus(bookingId: string, status: 'Approved' | 'Rejected' | 'Pending') {
    let booking: any = null
    let studentPhone: string | null = null

    try {
      console.log(`[BookingService] Starting database transaction to update booking ${bookingId} status to ${status}`)
      const transactionResult = await prisma.$transaction(async (tx) => {
        const b = await tx.booking.update({
          where: { id: bookingId },
          data: { status }
        })

        // Log Audit
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: `Booking ${status}`,
            details: `Updated booking ${bookingId} status to ${status}`
          }
        })

        // If approved, automatically enroll the student in the course
        if (status === 'Approved') {
          const user = await tx.user.findUnique({
            where: { email: b.studentEmail.toLowerCase() }
          })
          if (user) {
            const enrolled = [...user.enrolledCourses]
            if (!enrolled.includes(b.courseId)) {
              enrolled.push(b.courseId)
              await tx.user.update({
                where: { email: b.studentEmail.toLowerCase() },
                data: { enrolledCourses: enrolled }
              })
            }
          }
        }

        // Fetch student phone number
        const studentRecord = await tx.student.findUnique({
          where: { email: b.studentEmail.toLowerCase() }
        })

        return {
          booking: b,
          studentPhone: studentRecord?.phone || null
        }
      })
      booking = transactionResult.booking
      studentPhone = transactionResult.studentPhone
      console.log(`[BookingService] Database transaction successfully committed status update for booking ${bookingId}`)
    } catch (dbError: any) {
      console.error(`[BookingService] Database transaction failed to update status for booking ${bookingId}:`, dbError)
      throw new Error(`Database transaction failed: ${dbError.message || dbError}`)
    }

    // Send status update email to student asynchronously AFTER transaction has committed successfully
    if (booking) {
      const emailHtml = status === 'Approved'
        ? getBookingApprovedEmail(booking.studentName, booking.courseName, booking.date, booking.timeSlot)
        : getBookingRejectedEmail(booking.studentName, booking.courseName, booking.date, booking.timeSlot)

      sendSystemEmail(
        booking.studentEmail,
        `Booking Request ${status} - ${booking.courseName}`,
        emailHtml
      )
        .then(() => console.log(`[BookingService] Student status notification email successfully sent to ${booking.studentEmail}`))
        .catch(err => console.error('[BookingService] Failed to send status update email to student:', err))

      // Notify Student via WhatsApp (if phone exists)
      if (studentPhone) {
        const approvalText = status === 'Approved'
          ? `Your request is APPROVED! You can now log in to the Student Dashboard to access your materials.`
          : `We are unable to accommodate your booking request at this time. Please contact support to reschedule.`

        WhatsAppService.sendMessage(studentPhone, `Hello ${booking.studentName}, your booking status for ${booking.courseName} has been updated to: ${status.toUpperCase()}.
${approvalText}`)
          .catch(err => console.error('[BookingService] Failed to send student WhatsApp status notify:', err))
      }
    }

    return booking
  }
}
