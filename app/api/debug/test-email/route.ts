import { NextRequest, NextResponse } from 'next/server'
import { 
  verifySMTPConnection, 
  sendSystemEmail,
  getSignupVerificationEmail,
  getOtpVerificationEmail,
  getForgotPasswordEmail,
  getResetPasswordConfirmationEmail,
  getWelcomeEmail,
  getTrialBookingConfirmationEmail,
  getCourseBookingConfirmationEmail,
  getBookingApprovedEmail,
  getBookingRejectedEmail,
  getContactFormConfirmationEmail,
  getAdminNewStudentEmail,
  getAdminNewTrialBookingEmail,
  getAdminNewCourseBookingEmail,
  getAdminNewContactInquiryEmail
} from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get('email') || 'aamrule90@gmail.com'

    // 1. Verify connection
    console.log('[DEBUG-EMAIL] Running SMTP connection test...')
    const connCheck = await verifySMTPConnection()

    if (!connCheck.success) {
      return NextResponse.json({
        smtpConnectionVerified: false,
        message: connCheck.message,
        info: 'Console fallback is active. Enter your SMTP_PASSWORD in .env.local to test live emails.'
      })
    }

    // 2. Dispatch all emails in parallel
    console.log(`[DEBUG-EMAIL] Dispatching test email templates batch to ${testEmail}...`)
    
    const results = await Promise.allSettled([
      sendSystemEmail(testEmail, '[TEST 1/10] Signup Verification OTP', getSignupVerificationEmail('Test Student', '999888')),
      sendSystemEmail(testEmail, '[TEST 2/10] OTP Verification General', getOtpVerificationEmail('777666')),
      sendSystemEmail(testEmail, '[TEST 3/10] Forgot Password Reset OTP', getForgotPasswordEmail('555444')),
      sendSystemEmail(testEmail, '[TEST 4/10] Reset Password Confirmation', getResetPasswordConfirmationEmail(testEmail)),
      sendSystemEmail(testEmail, '[TEST 5/10] Welcome Student', getWelcomeEmail('Test Student')),
      sendSystemEmail(testEmail, '[TEST 6/10] Trial Booking Confirmation', getTrialBookingConfirmationEmail('Test Student', 'Acoustic Guitar Basics', '2026-08-10', '10:00 AM')),
      sendSystemEmail(testEmail, '[TEST 7/10] Course Booking Confirmation', getCourseBookingConfirmationEmail('Test Student', 'Classic Piano Masterclass', '2026-08-12', '02:00 PM', 'Evening')),
      sendSystemEmail(testEmail, '[TEST 8/10] Booking Approved Notice', getBookingApprovedEmail('Test Student', 'Classic Piano Masterclass', '2026-08-12', '02:00 PM')),
      sendSystemEmail(testEmail, '[TEST 9/10] Booking Declined Notice', getBookingRejectedEmail('Test Student', 'Classic Piano Masterclass', '2026-08-12', '02:00 PM')),
      sendSystemEmail(testEmail, '[TEST 10/10] Contact Form Confirmation', getContactFormConfirmationEmail('Test Visitor', 'Admissions Inquiry', 'Hello! I would like to enroll my child in piano classes.', '2026-08-05 12:00 PM')),
      sendSystemEmail('aamrule90@gmail.com', '[ADMIN TEST 1/4] New Student Registered Alert', getAdminNewStudentEmail('Test Student', testEmail)),
      sendSystemEmail('aamrule90@gmail.com', '[ADMIN TEST 2/4] New Trial Booking Request Alert', getAdminNewTrialBookingEmail('Test Student', testEmail, 'Acoustic Guitar Basics', '2026-08-10', '10:00 AM')),
      sendSystemEmail('aamrule90@gmail.com', '[ADMIN TEST 3/4] New Course Booking Request Alert', getAdminNewCourseBookingEmail('Test Student', testEmail, 'Classic Piano Masterclass', '2026-08-12', '02:00 PM', 'Evening')),
      sendSystemEmail('aamrule90@gmail.com', '[ADMIN TEST 4/4] New Contact Form Inquiry Alert', getAdminNewContactInquiryEmail('Test Visitor', testEmail, '+91 99999 88888', 'Admissions Inquiry', 'Hello! I would like to enroll my child in piano classes.', '2026-08-05 12:00 PM', '127.0.0.1'))
    ])

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length

    return NextResponse.json({
      smtpConnectionVerified: true,
      message: 'SMTP connection verified and test email batch triggered!',
      sentTo: testEmail,
      successfulSends: successCount,
      totalDispatched: results.length
    })
  } catch (err: any) {
    console.error('[DEBUG-EMAIL] Route failed:', err)
    return NextResponse.json({ error: err.message || 'Test route error.' }, { status: 500 })
  }
}
