import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find the instructor
    const instructor = await prisma.instructor.findUnique({
      where: { email }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    // Get count of courses for this instructor
    const coursesCount = await prisma.course.count({
      where: { instructorId: instructor.id }
    })

    // Update instructor status
    const now = new Date()
    const lastLoginStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const updatedBio = `Online | Last Login: ${lastLoginStr} | Courses: ${coursesCount} | Students: ${instructor.students || 0}`

    await prisma.instructor.update({
      where: { email },
      data: {
        bio: updatedBio,
        isActive: true
      }
    })

    // Create Admin Notification
    await prisma.notification.create({
      data: {
        title: '👩‍🏫 Instructor Logged In',
        message: `${instructor.name} is now online. Last login: ${lastLoginStr}`
      }
    })

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userEmail: email,
        action: 'Instructor Login',
        details: `${instructor.name} logged in. Status: Online.`
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in instructor login status update:', error)
    return NextResponse.json({ error: 'Failed to update login status' }, { status: 500 })
  }
}
