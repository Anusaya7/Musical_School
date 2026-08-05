import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVerificationTokenByToken, deleteVerificationToken } from '@/lib/db'
import { OtpService } from '@/lib/services/otp'
import { sendSystemEmail, getWelcomeEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json({ error: 'Missing token or email parameters' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    
    // If it's a 6-digit OTP link click, verify using OtpService
    if (token.length === 6 && /^\d+$/.test(token)) {
      const result = await OtpService.verifyOTP(lowerEmail, token)
      if (result.success) {
        const user = await prisma.user.findUnique({ where: { email: lowerEmail } })
        const welcomeHtml = getWelcomeEmail(user?.name || 'Student')
        await sendSystemEmail(lowerEmail, 'Welcome to 2nd Inversion Music School', welcomeHtml).catch(() => {})
        return NextResponse.json({ success: true, message: result.message })
      }
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    const storedToken = await getVerificationTokenByToken(token)

    if (!storedToken || storedToken.email.toLowerCase() !== lowerEmail) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
    }

    // Check expiration
    if (new Date() > new Date(storedToken.expires)) {
      await deleteVerificationToken(storedToken.id)
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 })
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: lowerEmail },
      data: { isVerified: true }
    })

    // Clean up token
    await deleteVerificationToken(storedToken.id)

    // Send Welcome Email
    const user = await prisma.user.findUnique({ where: { email: lowerEmail } })
    const welcomeHtml = getWelcomeEmail(user?.name || 'Student')
    await sendSystemEmail(lowerEmail, 'Welcome to 2nd Inversion Music School', welcomeHtml).catch(() => {})

    return NextResponse.json({ success: true, message: 'Email verified successfully!' })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const result = await OtpService.verifyOTP(email, otp)
    if (result.success) {
      // Send Welcome Email
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
      const welcomeHtml = getWelcomeEmail(user?.name || 'Student')
      await sendSystemEmail(email.toLowerCase(), 'Welcome to 2nd Inversion Music School', welcomeHtml).catch(() => {})

      return NextResponse.json({ success: true, message: result.message })
    }

    return NextResponse.json({ error: result.message }, { status: 400 })
  } catch (error: any) {
    console.error('OTP verification post error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
