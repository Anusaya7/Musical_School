import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { addPayment, addEnrolledCourse, addNotification, addAuditLog } from '@/lib/db'
import { sendSystemEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = await request.json()

    // Verify signature
    const isMock = razorpay_order_id?.startsWith('order_mock_')
    let isAuthentic = false

    if (isMock) {
      console.log('[RAZORPAY MOCK MODE] Bypassing signature verification for mock order:', razorpay_order_id)
      isAuthentic = true
    } else {
      const key_secret = process.env.RAZORPAY_KEY_SECRET
      if (!key_secret) {
        console.error('[PAYMENT] RAZORPAY_KEY_SECRET is not configured in production environment variables!')
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

      isAuthentic = expectedSignature === razorpay_signature
    }

    if (!isAuthentic) {
      console.warn('[PAYMENT] Signature verification failed')
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const paymentId = razorpay_payment_id
    const orderId = razorpay_order_id

    // Duplicate payment prevention
    const existingPayment = await prisma.payment.findFirst({
      where: { paymentId }
    })
    if (existingPayment) {
      console.log('[PAYMENT] Duplicate payment detected and bypassed:', paymentId)
      return NextResponse.json({
        success: true,
        message: 'Payment already verified and saved',
        paymentId,
        orderId
      })
    }

    // Extract order notes
    const studentEmail = orderData?.notes?.studentEmail || orderData?.studentEmail || 'student@2ndinversion.com'
    const studentName = orderData?.notes?.studentName || orderData?.studentName || 'John Doe'
    const courseId = orderData?.notes?.courseId || orderData?.courseId || 'piano-beginner'
    const courseName = orderData?.notes?.courseName || orderData?.courseName || 'Piano Beginner'
    const amount = Number(orderData?.amount || 4999)
    const invoiceNumber = `INV-${Date.now().toString().substring(3, 11)}`

    // 1. Save payment details to database
    const payment = {
      id: `PAY-${Date.now()}`,
      studentEmail,
      studentName,
      courseId,
      courseName,
      amount,
      paymentId,
      orderId,
      status: 'Success' as const,
      createdAt: new Date().toISOString(),
      invoiceNumber
    }
    await addPayment(payment)

    // 2. Grant access to course (enrollment)
    await addEnrolledCourse(studentEmail, courseId)

    // 3. Create Admin Notification
    const notifId = `notif-${Date.now()}`
    await addNotification({
      id: notifId,
      title: 'New Course Purchase',
      message: `${studentName} successfully purchased ${courseName} for ₹${amount.toLocaleString('en-IN')}`,
      createdAt: new Date().toISOString(),
      isRead: false
    })

    // 4. Log Audit Activity
    await addAuditLog({
      id: `log-${Date.now()}`,
      userEmail: studentEmail,
      action: 'Course Purchase',
      details: `Purchased course: ${courseName} (Amount: ₹${amount}, Payment ID: ${paymentId})`,
      createdAt: new Date().toISOString()
    })

    // 5. Send Confirmation Email to Student
    const studentHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #6d28d9;">Payment Confirmation</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>Thank you for enrolling in <strong>${courseName}</strong> at 2nd Inversion Musical School!</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
          <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
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
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Course Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${courseName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Amount Paid</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Payment ID</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date & Time</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Status</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">SUCCESS</td>
          </tr>
        </table>
      </div>
    `

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
      await Promise.all([
        sendSystemEmail(studentEmail, `Enrollment Confirmation - ${courseName}`, studentHtml),
        sendSystemEmail(adminEmail, 'New Course Purchase Alert', adminHtml)
      ])
    } catch (emailErr: any) {
      console.error('[EMAIL ERROR] Failed to send enrollment notification emails:', emailErr)
      return NextResponse.json(
        { success: false, error: `Email delivery failed: ${emailErr.message || emailErr}` },
        { status: 500 }
      )
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
