import { NextResponse } from 'next/server'
import { OtpService } from '@/lib/services/otp'
import { sendSystemEmail, getSignupVerificationEmail } from '@/lib/email'
import { getUserByEmail } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    const user = await getUserByEmail(lowerEmail)
    if (!user) {
      return NextResponse.json({ error: 'No user registered with this email address' }, { status: 404 })
    }

    try {
      const otp = await OtpService.generateOTP(lowerEmail)

      // Send Verification Email to Student with new OTP
      const studentHtml = getSignupVerificationEmail(user.name, otp)
      await sendSystemEmail(lowerEmail, 'Verify Your Email Address - New OTP Code', studentHtml)

      return NextResponse.json({ success: true, message: 'A new 6-digit verification code has been sent to your email.' })
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to resend OTP' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error during resending verification email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
