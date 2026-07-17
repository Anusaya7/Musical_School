import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { studentEmail, studentName, courseId, courseName, amount, errorDescription, orderId } = await request.json()

    // 1. Create a Payment record with status 'Failed'
    await prisma.payment.create({
      data: {
        id: `PAY-${Date.now()}`,
        studentEmail: studentEmail || 'unknown@gmail.com',
        studentName: studentName || 'Unknown Student',
        courseId: courseId || 'unknown',
        courseName: courseName || 'Unknown Course',
        amount: Number(amount || 0),
        paymentId: 'FAILED',
        orderId: orderId || 'unknown',
        status: 'Failed',
        invoiceNumber: null
      }
    })

    // 2. Create Admin Notification
    await prisma.notification.create({
      data: {
        title: '❌ Failed Payment Alert',
        message: `${studentName || 'Student'} failed to purchase ${courseName || 'Course'} (Amount: ₹${(amount || 0).toLocaleString('en-IN')}). Error: ${errorDescription || 'Declined'}`
      }
    })

    // 3. Log Activity
    await prisma.auditLog.create({
      data: {
        userEmail: studentEmail || 'unknown@gmail.com',
        action: 'Payment Failed',
        details: `Failed to purchase ${courseName || 'Course'}. Error: ${errorDescription || 'Declined'}`
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging failed payment:', error)
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 })
  }
}
