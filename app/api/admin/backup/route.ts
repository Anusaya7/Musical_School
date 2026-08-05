import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      courses,
      instruments,
      instructors,
      users,
      bookings,
      payments,
      students,
      certificates,
      attendance,
      assignments,
      submissions,
      coupons,
      referrals,
      inquiries,
      auditLogs
    ] = await Promise.all([
      prisma.course.findMany(),
      prisma.instrument.findMany(),
      prisma.instructor.findMany(),
      prisma.user.findMany(),
      prisma.booking.findMany(),
      prisma.payment.findMany(),
      prisma.student.findMany(),
      prisma.certificate.findMany(),
      prisma.attendance.findMany(),
      prisma.assignment.findMany(),
      prisma.submission.findMany(),
      prisma.coupon.findMany(),
      prisma.referral.findMany(),
      prisma.contactInquiry.findMany(),
      prisma.auditLog.findMany()
    ])

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        courses,
        instruments,
        instructors,
        users,
        bookings,
        payments,
        students,
        certificates,
        attendance,
        assignments,
        submissions,
        coupons,
        referrals,
        inquiries,
        auditLogs
      }
    }

    const filename = `musical-school-backup-${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error: any) {
    console.error('Backup error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
