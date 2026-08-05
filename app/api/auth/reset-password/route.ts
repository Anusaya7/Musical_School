import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deletePasswordResetToken } from '@/lib/db'
import { OtpService } from '@/lib/services/otp'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json()

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Email, token, and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    const verifyResult = await OtpService.verifyPasswordResetOTP(lowerEmail, token)

    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.message }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { email: lowerEmail },
      data: { passwordHash }
    })

    // Clean up token
    if (verifyResult.storedTokenId) {
      await deletePasswordResetToken(verifyResult.storedTokenId)
    }

    return NextResponse.json({ success: true, message: 'Password reset successfully!' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
