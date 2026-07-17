import { NextResponse } from 'next/server'
import { createUser, addNotification, addAuditLog, getUserByEmail } from '@/lib/db'
import { sendSystemEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
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
      // 1. Create Student record in Student model
      try {
        await prisma.student.create({
          data: {
            id: userId,
            name,
            email: email.toLowerCase(),
            status: 'Active'
          }
        })
      } catch (studentErr) {
        console.error('Failed to create Student model record:', studentErr)
      }

      // 2. Create Admin Notification
      await addNotification({
        id: `notif-${Date.now()}`,
        title: 'New Student Registered',
        message: `Name: ${name}\nEmail: ${email}`,
        createdAt: new Date().toISOString(),
        isRead: false
      })

      // 3. Log Activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: email,
        action: 'Student Registered',
        details: `New student signed up: ${name} (${email})`,
        createdAt: new Date().toISOString()
      })

      // 4. Send Email Notification to Admin
      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1.5px solid #e6eeff; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #2563eb; margin-top: 0;">New Student Registered</h2>
          <p>A new student has registered on the Music School LMS platform.</p>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e6eeff;">
            <p style="margin: 6px 0; font-size: 13px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">Regards,<br/>2nd Inversion LMS System</p>
        </div>
      `
      await sendSystemEmail('aamrule90@gmail.com', `New Student Registered - ${name}`, adminHtml)

      return NextResponse.json({ success: true, user: { name, email, role: 'STUDENT' } })
    }

    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 })
  } catch (error) {
    console.error('Error during student registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
