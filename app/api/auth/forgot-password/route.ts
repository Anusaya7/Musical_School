import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import { sendSystemEmail, getForgotPasswordEmail } from '@/lib/email'
import { OtpService } from '@/lib/services/otp'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    const user = await getUserByEmail(lowerEmail)

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 })
    }

    // Generate 6-digit OTP
    let otp: string
    try {
      otp = await OtpService.generatePasswordResetOTP(lowerEmail)
    } catch (rateLimitErr: any) {
      return NextResponse.json({ error: rateLimitErr.message || 'Please wait before requesting another code.' }, { status: 429 })
    }

    const emailHtml = getForgotPasswordEmail(otp)

    await sendSystemEmail(lowerEmail, 'Reset Your Password Code', emailHtml)

    return NextResponse.json({ success: true, message: 'Password reset code sent to your email.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
