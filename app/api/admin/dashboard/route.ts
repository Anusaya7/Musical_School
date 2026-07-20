import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CourseStatus } from '@/lib/generated/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      coursesCount,
      studentsCount,
      instructorsCount,
      bookingsCount,
      pendingBookingsCount,
      paymentsAggregate,
      contactInquiriesCount,
      recentActivities
    ] = await Promise.all([
      // 1. Published Courses count (excluding Saxophone category which is Upcoming/Coming Soon)
      prisma.course.count({
        where: {
          status: CourseStatus.PUBLISHED,
          instrumentId: { not: 'saxophone' }
        }
      }),
      // 2. Students count
      prisma.student.count(),
      // 3. Instructors count
      prisma.instructor.count(),
      // 4. Bookings count
      prisma.booking.count(),
      // 5. Pending Bookings count
      prisma.booking.count({
        where: { status: 'Pending' }
      }),
      // 6. Successful Payments sum
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: { in: ['Success', 'SUCCESS', 'Completed', 'COMPLETED', 'Paid', 'PAID'] }
        }
      }),
      // 7. Contact Inquiries count
      prisma.contactInquiry.count(),
      // 8. Recent Activities (from AuditLog)
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return NextResponse.json({
      courses: coursesCount,
      students: studentsCount,
      instructors: instructorsCount,
      bookings: bookingsCount,
      pendingBookings: pendingBookingsCount,
      revenue: paymentsAggregate._sum.amount || 0,
      contactInquiries: contactInquiriesCount,
      recentActivities: recentActivities
    })
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 550 })
  }
}
