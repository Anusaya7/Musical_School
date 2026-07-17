import { NextResponse } from 'next/server'
import { createUser, addNotification, addAuditLog, getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userId = `usr-${Date.now()}`
    
    const user = {
      id: userId,
      name,
      email,
      passwordHash,
      role: 'STUDENT' as const,
      isVerified: true,
      status: 'Active' as const,
      enrolledCourses: [],
      createdAt: new Date().toISOString()
    }

    const success = await createUser(user)
    if (success) {
      // 1. Create Admin Notification
      await addNotification({
        id: `notif-${Date.now()}`,
        title: 'New Student Registered',
        message: `Name: ${name}\nEmail: ${email}`,
        createdAt: new Date().toISOString(),
        isRead: false
      })

      // 2. Log Activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: email,
        action: 'Student Registered',
        details: `New student signed up: ${name} (${email})`,
        createdAt: new Date().toISOString()
      })

      return NextResponse.json({ success: true, user: { name, email, role: 'STUDENT' } })
    }

    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 })
  } catch (error) {
    console.error('Error during student registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
