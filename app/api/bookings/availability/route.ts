import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public availability for a course on a date.
 * Returns time slots already held by Pending / Approved / Booked bookings.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')?.trim() || ''
    const courseId = searchParams.get('courseId')?.trim() || ''

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Valid date (YYYY-MM-DD) is required' }, { status: 400 })
    }
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        courseId,
        date,
        status: { in: ['Pending', 'Approved', 'Booked'] }
      },
      select: {
        timeSlot: true,
        batchTiming: true,
        status: true
      }
    })

    const bookedSlots = Array.from(
      new Set(bookings.map(b => b.timeSlot).filter(Boolean))
    )

    return NextResponse.json({
      success: true,
      date,
      courseId,
      bookedSlots,
      bookings: bookings.map(b => ({
        timeSlot: b.timeSlot,
        batchTiming: b.batchTiming,
        status: b.status
      }))
    })
  } catch (error) {
    console.error('[AVAILABILITY] Failed to load slot availability', error)
    return NextResponse.json({ error: 'Failed to load availability' }, { status: 500 })
  }
}
