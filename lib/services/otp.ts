import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export class OtpService {
  /**
   * Generates a 6-digit OTP, hashes it, and stores it in the VerificationToken table.
   * Restricts OTP generation to a 1-minute rate limit.
   */
  static async generateOTP(email: string): Promise<string> {
    const lowerEmail = email.toLowerCase()

    // 1. Rate Limiting Check: Check if an OTP was created recently (within last 60 seconds)
    const existingToken = await prisma.verificationToken.findFirst({
      where: { email: lowerEmail }
    })

    if (existingToken) {
      const timeSinceLastOtp = Date.now() - new Date(existingToken.createdAt).getTime()
      if (timeSinceLastOtp < 60 * 1000) {
        throw new Error('Please wait 60 seconds before requesting another OTP.')
      }
      
      // Clean up previous token
      await prisma.verificationToken.delete({
        where: { id: existingToken.id }
      }).catch(() => {})
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Hash OTP using SHA-256
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

    // 4. Expiry (5 minutes)
    const expires = new Date(Date.now() + 5 * 60 * 1000)

    // 5. Store in DB
    await prisma.verificationToken.create({
      data: {
        email: lowerEmail,
        token: hashedOtp,
        expires
      }
    })

    return otp
  }

  /**
   * Verifies an OTP code against the hashed value in the database.
   */
  static async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const lowerEmail = email.toLowerCase()
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

    const storedToken = await prisma.verificationToken.findUnique({
      where: { token: hashedOtp }
    })

    if (!storedToken || storedToken.email.toLowerCase() !== lowerEmail) {
      return { success: false, message: 'Invalid verification code.' }
    }

    // Check expiration
    if (new Date() > new Date(storedToken.expires)) {
      await prisma.verificationToken.delete({
        where: { id: storedToken.id }
      }).catch(() => {})
      return { success: false, message: 'Verification code has expired.' }
    }

    // Update user status to verified
    await prisma.user.update({
      where: { email: lowerEmail },
      data: { isVerified: true }
    })

    // Delete token
    await prisma.verificationToken.delete({
      where: { id: storedToken.id }
    }).catch(() => {})

    return { success: true, message: 'Email verified successfully!' }
  }

  /**
   * Generates a 6-digit password reset OTP, hashes it, and stores it in the PasswordResetToken table.
   * Restricts OTP generation to a 1-minute rate limit.
   */
  static async generatePasswordResetOTP(email: string): Promise<string> {
    const lowerEmail = email.toLowerCase()

    // 1. Rate Limiting Check
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { email: lowerEmail }
    })

    if (existingToken) {
      const timeSinceLastOtp = Date.now() - new Date(existingToken.createdAt).getTime()
      if (timeSinceLastOtp < 60 * 1000) {
        throw new Error('Please wait 60 seconds before requesting another password reset code.')
      }

      // Clean up previous token
      await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
      }).catch(() => {})
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Hash OTP using SHA-256
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

    // 4. Expiry (5 minutes)
    const expires = new Date(Date.now() + 5 * 60 * 1000)

    // 5. Store in DB
    await prisma.passwordResetToken.create({
      data: {
        email: lowerEmail,
        token: hashedOtp,
        expires
      }
    })

    return otp
  }

  /**
   * Verifies a password reset OTP code against the hashed value in the database.
   */
  static async verifyPasswordResetOTP(email: string, otp: string): Promise<{ success: boolean; message: string; storedTokenId?: string }> {
    const lowerEmail = email.toLowerCase()
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedOtp }
    })

    if (!storedToken || storedToken.email.toLowerCase() !== lowerEmail) {
      return { success: false, message: 'Invalid or expired password reset code.' }
    }

    // Check expiration
    if (new Date() > new Date(storedToken.expires)) {
      await prisma.passwordResetToken.delete({
        where: { id: storedToken.id }
      }).catch(() => {})
      return { success: false, message: 'Password reset code has expired.' }
    }

    return { success: true, message: 'Code verified.', storedTokenId: storedToken.id }
  }
}
