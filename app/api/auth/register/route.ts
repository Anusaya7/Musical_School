import { NextResponse } from 'next/server'
import { createUser, addNotification, addAuditLog, getUserByEmail, createVerificationToken } from '@/lib/db'
import { sendSystemEmail, getSignupVerificationEmail, getAdminNewStudentEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { OtpService } from '@/lib/services/otp'
import { WhatsAppService } from '@/lib/services/whatsapp'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import crypto from 'crypto'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)
    
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    const { name, email, password } = validation.data
    const lowerEmail = email.toLowerCase()

    // Check if user already exists
    const existing = await getUserByEmail(lowerEmail)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userId = `usr-${Date.now()}`
    
    const user = {
      id: userId,
      name,
      email: lowerEmail,
      passwordHash,
      role: 'STUDENT' as const,
      isVerified: false, // Must be verified via email first
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
            email: lowerEmail,
            status: 'Active'
          }
        })
      } catch (studentErr) {
        console.error('Failed to create Student model record:', studentErr)
      }

      // 2. Generate 6-digit OTP
      const otp = await OtpService.generateOTP(lowerEmail)

      // 3. Create Admin Notification
      await addNotification({
        id: `notif-${Date.now()}`,
        title: 'New Student Registered',
        message: `Name: ${name}\nEmail: ${lowerEmail} (Awaiting OTP Verification)`,
        createdAt: new Date().toISOString(),
        isRead: false
      })

      // 4. Log Activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: lowerEmail,
        action: 'Student Registered',
        details: `New student signed up: ${name} (${lowerEmail}) - Awaiting OTP verification`,
        createdAt: new Date().toISOString()
      })

      // 5. Send Verification Email to Student with OTP (required)
      let emailSent = false
      try {
        const studentHtml = getSignupVerificationEmail(name, otp)
        await sendSystemEmail(lowerEmail, 'Verify Your Email Address', studentHtml)
        emailSent = true

        // 6. Admin notify (non-blocking for signup)
        const adminHtml = getAdminNewStudentEmail(name, lowerEmail)
        const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
        await sendSystemEmail(adminEmail, `New Student Registered - ${name}`, adminHtml).catch((err) => {
          console.error('[AUTH-REGISTER] Admin email failed:', err)
        })
      } catch (mailErr) {
        console.error('[AUTH-REGISTER] Failed to send verification email:', mailErr)
      }

      // 7. Send WhatsApp Notification to Admin
      try {
        await WhatsAppService.sendMessage('917768838832', `Hello Admin, a new student has registered on the 2nd Inversion LMS:
Name: ${name}
Email: ${lowerEmail}
Status: Awaiting OTP Verification`)
      } catch (waErr) {
        console.error('[AUTH-REGISTER] Failed to send WhatsApp notification:', waErr)
      }

      if (!emailSent) {
        return NextResponse.json({
          success: true,
          emailSent: false,
          error: 'Account created, but verification email failed to send. Use Resend Code on the next screen.',
          user: { name, email: lowerEmail, role: 'STUDENT' }
        })
      }

      return NextResponse.json({
        success: true,
        emailSent: true,
        message: 'Registration successful! Verification email sent.',
        user: { name, email: lowerEmail, role: 'STUDENT' }
      })
    }

    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 })
  } catch (error) {
    console.error('Error during student registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
