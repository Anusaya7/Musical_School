import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { instructorEmail, instructorName, action, details } = await request.json()

    if (!instructorEmail || !instructorName || !action || !details) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // 1. Create Admin Notification
    let emoji = '👩‍🏫'
    if (action.includes('Recording')) emoji = '🎥'
    if (action.includes('Assignment')) emoji = '📝'
    if (action.includes('Leave')) emoji = '📅'
    if (action.includes('Workshop')) emoji = '🚀'
    if (action.includes('Schedule')) emoji = '🕒'

    await prisma.notification.create({
      data: {
        title: `${emoji} Instructor Action: ${action}`,
        message: `Instructor ${instructorName} (${instructorEmail}) performed action: ${details}`
      }
    })

    // 2. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userEmail: instructorEmail,
        action: `Instructor ${action}`,
        details: `${instructorName} - ${details}`
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording instructor action:', error)
    return NextResponse.json({ error: 'Failed to record instructor action' }, { status: 500 })
  }
}
