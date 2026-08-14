import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { addEnrolledCourse } from '@/lib/db'
import { sendSystemEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = await request.json()

    // 1. Verify signature
    let isAuthentic = false

    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_secret) {
      console.error('[PAYMENT] RAZORPAY_KEY_SECRET is not configured!')
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration missing' },
        { status: 500 }
      )
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex')

    try {
      const expectedBuf = Buffer.from(expectedSignature, 'utf-8')
      const recBuf = Buffer.from(razorpay_signature || '', 'utf-8')
      isAuthentic = expectedBuf.length === recBuf.length && crypto.timingSafeEqual(expectedBuf, recBuf)
    } catch (err) {
      isAuthentic = false
    }

    if (!isAuthentic) {
      console.warn('[PAYMENT] Signature verification failed. Expected:', expectedSignature, 'Received:', razorpay_signature)
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const studentEmail = orderData?.notes?.studentEmail || orderData?.studentEmail || 'student@2ndinversion.com'
    const studentName = orderData?.notes?.studentName || orderData?.studentName || 'John Doe'
    const courseId = orderData?.notes?.courseId || orderData?.courseId || 'piano-beginner'
    const courseName = orderData?.notes?.courseName || orderData?.courseName || 'Piano Beginner'
    const amount = Number(orderData?.amount || 3500)
    const purchaseType = orderData?.notes?.purchaseType || 'course'

    const paymentId = razorpay_payment_id
    const orderId = razorpay_order_id
    const invoiceNumber = `INV-${Date.now().toString().substring(3, 11)}`

    // Check if payment with this paymentId already exists
    if (paymentId) {
      const existingPayment = await prisma.payment.findFirst({
        where: {
          paymentId
        }
      })
      if (existingPayment) {
        console.log('[PAYMENT] Duplicate payment verification request received for paymentId:', paymentId)
        
        let bookingId = `BK-${existingPayment.id.split('-')[1] || Date.now()}`
        let bookedSlot = '—'
        let expectedStartDate = '—'
        let instructorName = 'Ajinkya Amrule'
        let courseDuration = '3 Months'

        if (purchaseType === 'booking') {
          const existingBooking = await prisma.booking.findFirst({
            where: {
              paymentId
            }
          })
          if (existingBooking) {
            bookingId = existingBooking.id
            bookedSlot = `${existingBooking.date} at ${existingBooking.timeSlot} (${existingBooking.batchTiming} Batch)`
            expectedStartDate = existingBooking.date
            instructorName = existingBooking.instructor
          }
        }

        try {
          const courseDetails = await prisma.course.findUnique({ where: { id: courseId } })
          if (courseDetails?.duration) {
            courseDuration = courseDetails.duration
          }
        } catch (err) {}

        return NextResponse.json({
          success: true,
          message: 'Payment already processed and verified successfully (duplicate request)',
          bookingId,
          paymentId,
          orderId,
          courseName,
          amount,
          paymentDate: existingPayment.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          studentEmail,
          instructorName,
          courseDuration,
          bookedSlot,
          expectedStartDate
        })
      }
    }

    // 2. Handle trial/class booking payment flow
    if (purchaseType === 'booking') {
      const date = orderData.notes.date
      const timeSlot = orderData.notes.timeSlot
      const batchTiming = orderData.notes.batchTiming
      const instructor = orderData.notes.instructor || 'Ajinkya Amrule'

      // Double payment and duplicate booking check: student cannot book same slot twice
      const existingUserBooking = await prisma.booking.findFirst({
        where: {
          studentEmail,
          courseId,
          date,
          timeSlot
        }
      })
      if (existingUserBooking) {
        return NextResponse.json(
          { success: false, error: 'You have already booked this course slot' },
          { status: 400 }
        )
      }

      // Slot blocking: prevent anyone else booking the same slot/date combo
      const slotBlocked = await prisma.booking.findFirst({
        where: {
          date,
          timeSlot,
          status: { in: ['Confirmed', 'Booked'] }
        }
      })
      if (slotBlocked) {
        return NextResponse.json(
          { success: false, error: 'This time slot is already booked by another student' },
          { status: 400 }
        )
      }

      const bookingId = `BK-${Date.now()}`

      // Create booking, payment, enrollment and notify in a clean transaction
      const result = await prisma.$transaction(async (tx) => {
        const bk = await tx.booking.create({
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
            status: 'Confirmed',
            amount,
            paymentMethod: 'Razorpay',
            studentId: studentEmail,
            paymentId,
            orderId,
            paymentStatus: 'Success',
            receiptNumber: invoiceNumber,
            emailStatus: 'Sent',
            notificationStatus: 'Created'
          }
        })

        await tx.payment.create({
          data: {
            id: `PAY-${Date.now()}`,
            studentEmail,
            studentName,
            courseId,
            courseName,
            amount,
            paymentId,
            orderId,
            status: 'Success',
            invoiceNumber
          }
        })

        await tx.notification.create({
          data: {
            title: 'New Class Booking Paid',
            message: `${studentName} booked ${courseName} on ${date} at ${timeSlot} (Amount: ₹${amount.toLocaleString('en-IN')})`
          }
        })

        await tx.auditLog.create({
          data: {
            userEmail: studentEmail,
            action: 'Booking Payment Success',
            details: `Class booked: ${courseName} on ${date} at ${timeSlot} (Payment ID: ${paymentId})`
          }
        })

        // Run user enrollment inside transaction
        const user = await tx.user.findUnique({
          where: { email: studentEmail.toLowerCase() }
        })
        if (user) {
          const enrolled = [...user.enrolledCourses]
          if (!enrolled.includes(courseId)) {
            enrolled.push(courseId)
            await tx.user.update({
              where: { email: studentEmail.toLowerCase() },
              data: { enrolledCourses: enrolled }
            })
          }
        }

        // Upsert student record and create enrollment for Admin tracking
        const studentObj = await tx.student.upsert({
          where: { email: studentEmail.toLowerCase() },
          update: {
            name: studentName,
            status: 'Active'
          },
          create: {
            name: studentName,
            email: studentEmail.toLowerCase(),
            status: 'Active'
          }
        })

        await tx.enrollment.create({
          data: {
            studentId: studentObj.id,
            courseId,
            courseName,
            amount,
            status: 'Active'
          }
        })

        return bk
      }, {
        maxWait: 8000,
        timeout: 15000
      })

      // Send Email to student and admin
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 25px; color: #1e293b; background-color: #fafafa; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1.5px solid #e6eeff;">
          <h2 style="color: #2563eb; margin-top: 0;">Class Booking Confirmation</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Your class booking for <strong>${courseName}</strong> has been successfully paid and confirmed!</p>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e6eeff; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <h4 style="margin: 0 0 10px 0; color: #0f1e4a; border-bottom: 1.5px solid #e6eeff; pb: 8px;">Receipt & Booking Details</h4>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Course:</strong> ${courseName}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Instructor:</strong> ${instructor}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Time Slot:</strong> ${timeSlot} (${batchTiming})</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Transaction ID:</strong> ${paymentId}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Invoice:</strong> ${invoiceNumber}</p>
          </div>
          <p style="font-size: 13px;">Please log in to your Student Dashboard to access materials and manage schedules.</p>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">Regards,<br/>2nd Inversion Team</p>
        </div>
      `
      
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
        await Promise.all([
          sendSystemEmail(studentEmail, `Booking Confirmed - ${courseName}`, emailHtml),
          sendSystemEmail(adminEmail, `New Booking Alert - ${studentName}`, emailHtml)
        ])
      } catch (emailErr: any) {
        console.error('[EMAIL ERROR] Failed to send booking notification emails (gracefully ignored):', emailErr)
      }

      // Get course details for additional success info
      let courseDuration = '3 Months'
      try {
        const courseDetails = await prisma.course.findUnique({ where: { id: courseId } })
        if (courseDetails?.duration) {
          courseDuration = courseDetails.duration
        }
      } catch (err) {
        console.error('Error fetching course duration:', err)
      }

      return NextResponse.json({
        success: true,
        message: 'Booking payment verified and saved successfully',
        bookingId,
        paymentId,
        orderId,
        courseName,
        amount,
        paymentDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        studentEmail,
        instructorName: instructor,
        courseDuration,
        bookedSlot: `${date} at ${timeSlot} (${batchTiming} Batch)`,
        expectedStartDate: date
      })
    }

    // 3. Handle standard course purchase flow
    const courseIdsStr = orderData?.notes?.courseIds || orderData?.courseIds
    const courseIds = courseIdsStr
      ? String(courseIdsStr).split(',').map((id: string) => id.trim())
      : [courseId]

    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } }
    })

    if (courses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'The requested courses do not exist' },
        { status: 404 }
      )
    }

    const totalPaid = courses.reduce((sum, c) => sum + c.price, 0)

    await prisma.$transaction(async (tx) => {
      const studentObj = await tx.student.upsert({
        where: { email: studentEmail.toLowerCase() },
        update: {
          name: studentName,
          status: 'Active'
        },
        create: {
          name: studentName,
          email: studentEmail.toLowerCase(),
          status: 'Active'
        }
      })

      for (const c of courses) {
        const individualInvoice = `INV-${Date.now()}-${c.id.substring(0, 3)}`
        await tx.payment.create({
          data: {
            id: `PAY-${Date.now()}-${c.id}`,
            studentEmail,
            studentName,
            courseId: c.id,
            courseName: c.title,
            amount: c.price,
            paymentId,
            orderId,
            status: 'Success',
            invoiceNumber: individualInvoice
          }
        })

        await tx.enrollment.create({
          data: {
            studentId: studentObj.id,
            courseId: c.id,
            courseName: c.title,
            amount: c.price,
            status: 'Active'
          }
        })
        
        await tx.notification.create({
          data: {
            title: 'New Course Purchase',
            message: `${studentName} successfully purchased ${c.title} for ₹${c.price.toLocaleString('en-IN')}`
          }
        })

        await tx.auditLog.create({
          data: {
            userEmail: studentEmail,
            action: 'Course Purchase',
            details: `Purchased course: ${c.title} (Amount: ₹${c.price}, Payment ID: ${paymentId})`
          }
        })

        // Grant access
        const user = await tx.user.findUnique({
          where: { email: studentEmail.toLowerCase() }
        })
        if (user) {
          const enrolled = [...user.enrolledCourses]
          if (!enrolled.includes(c.id)) {
            enrolled.push(c.id)
            await tx.user.update({
              where: { email: studentEmail.toLowerCase() },
              data: { enrolledCourses: enrolled }
            })
          }
        }
      }
    }, {
      maxWait: 10000,
      timeout: 20000
    })

    const coursesHtmlList = courses.map(c => `<li><strong>${c.title}</strong> - ₹${c.price.toLocaleString('en-IN')}</li>`).join('')
    const coursesTextList = courses.map(c => c.title).join(', ')

    const studentHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #6d28d9;">Payment Confirmation</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>Thank you for enrolling in the following courses at 2nd Inversion Musical School!</p>
        <ul>
          ${coursesHtmlList}
        </ul>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
          <p style="margin: 5px 0;"><strong>Total Amount Paid:</strong> ₹${totalPaid.toLocaleString('en-IN')}</p>
          <p style="margin: 5px 0;"><strong>Enrollment Status:</strong> Active</p>
        </div>
        <p>You can now log in to your student portal and access the recorded video sessions and study materials.</p>
        <p>Regards,<br/>2nd Inversion Team</p>
      </div>
    `
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #6d28d9;">New Course Purchase Notification</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Student Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Student Email</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${studentEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Courses</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coursesTextList}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Total Amount Paid</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${totalPaid.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Payment ID</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date & Time</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
      </div>
    `

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
      await Promise.all([
        sendSystemEmail(studentEmail, `Enrollment Confirmation`, studentHtml),
        sendSystemEmail(adminEmail, 'New Course Purchase Alert', adminHtml)
      ])
    } catch (emailErr: any) {
      console.error('[EMAIL ERROR] Failed to send course enrollment notification emails (gracefully ignored):', emailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and saved successfully',
      paymentId,
      orderId
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
