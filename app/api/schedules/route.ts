import { NextResponse } from 'next/server'
import { getSchedules, updateSchedules } from '@/lib/db'

export async function GET() {
  try {
    const schedules = await getSchedules()
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Body should be an array of BatchSchedule
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid batch schedule array' }, { status: 400 })
    }

    const success = await updateSchedules(body)
    if (success) {
      const { addAuditLog, addNotification } = await import('@/lib/db')
      // Log audit
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Schedule Changed',
        details: `Updated batch schedules: ${body.map(s => `${s.name} (${s.startTime}-${s.endTime})`).join(', ')}`,
        createdAt: new Date().toISOString()
      })
      // Create notification
      await addNotification({
        id: `notif-${Date.now()}`,
        title: '📅 Schedule Updated',
        message: `Admin updated batch schedules.`,
        createdAt: new Date().toISOString(),
        isRead: false
      })

      return NextResponse.json({ success: true, schedules: body })
    } else {
      return NextResponse.json({ error: 'Failed to update schedules' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save schedules' }, { status: 500 })
  }
}
