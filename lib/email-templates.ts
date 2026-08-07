/**
 * Reusable HTML Email Templates for 2nd Inversion Music School.
 * All designs are responsive, clean, and carry premium typography and branding.
 */

interface EmailBaseParams {
  title: string
  preheader?: string
  contentHtml: string
}

function getBaseTemplate({ title, preheader, contentHtml }: EmailBaseParams): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f6f9fc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            color: #334155;
          }
          table {
            border-collapse: collapse;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(15, 30, 74, 0.03);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #0f1e4a;
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header p {
            color: #5ea8ff;
            margin: 4px 0 0 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .content {
            padding: 40px 32px;
            line-height: 1.6;
            font-size: 15px;
          }
          .content h2 {
            color: #0f1e4a;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .content p {
            margin-top: 0;
            margin-bottom: 16px;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            background-color: #0f1e4a;
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            display: inline-block;
            box-shadow: 0 4px 10px rgba(15, 30, 74, 0.15);
          }
          .otp-container {
            text-align: center;
            margin: 32px 0;
          }
          .otp-code {
            background-color: #f1f5f9;
            color: #0f1e4a;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 8px;
            display: inline-block;
            border: 2px dashed #cbd5e1;
          }
          .details-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          .details-row {
            margin-bottom: 8px;
            font-size: 13px;
          }
          .details-row:last-child {
            margin-bottom: 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
          }
          .footer a {
            color: #5ea8ff;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f9fc; padding: 40px 0;">
          <tr>
            <td>
              <div class="container">
                <!-- Header -->
                <div class="header">
                  <h1>🎵 2nd Inversion</h1>
                  <p>Music School Management</p>
                </div>
                <!-- Content -->
                <div class="content">
                  ${contentHtml}
                </div>
                <!-- Footer -->
                <div class="footer">
                  <p>© ${new Date().getFullYear()} 2nd Inversion Music School. All rights reserved.</p>
                  <p><strong>Ajinkya Uddhav Amrule</strong> | Founder & Director</p>
                  <p>Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061, Maharashtra, India</p>
                  <p>Phone: <a href="tel:+917768838832">+91 77688 38832</a> | Email: <a href="mailto:aamrule90@gmail.com">aamrule90@gmail.com</a></p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

/**
 * 1. Signup Verification Email HTML
 */
export function getSignupVerificationEmail(name: string, otp: string): string {
  const contentHtml = `
    <h2>Verify Your Email Address</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering at 2nd Inversion Music School! Please use the following 6-digit verification code (OTP) to verify your email address and complete your signup:</p>
    <div class="otp-container">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="font-size: 13px; color: #64748b; text-align: center;">This verification code is valid for 5 minutes.</p>
    <p>If you did not initiate this request, you can safely ignore this email.</p>
  `
  return getBaseTemplate({ title: 'Verify Your Email Address', contentHtml })
}

/**
 * 2. OTP Verification Email HTML (General/Resend)
 */
export function getOtpVerificationEmail(otp: string): string {
  const contentHtml = `
    <h2>Verification Code</h2>
    <p>Hello,</p>
    <p>Your requested 6-digit one-time security code is listed below:</p>
    <div class="otp-container">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="font-size: 13px; color: #64748b; text-align: center;">This code is valid for 5 minutes.</p>
    <p>For security, do not share this code with anyone.</p>
  `
  return getBaseTemplate({ title: 'Your Verification Code', contentHtml })
}

/**
 * 3. Forgot Password OTP Email HTML
 */
export function getForgotPasswordEmail(otp: string): string {
  const contentHtml = `
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset the password for your 2nd Inversion Music School account. Please use the following 6-digit verification code to proceed:</p>
    <div class="otp-container">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="font-size: 13px; color: #64748b; text-align: center;">This code is valid for 5 minutes.</p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
  `
  return getBaseTemplate({ title: 'Reset Your Password Code', contentHtml })
}

/**
 * 4. Reset Password Confirmation Email HTML
 */
export function getResetPasswordConfirmationEmail(email: string): string {
  const contentHtml = `
    <h2>Password Reset Successful</h2>
    <p>Hello,</p>
    <p>This is to confirm that the password for your account <strong>${email}</strong> has been updated successfully.</p>
    <p>If you did not perform this action, please contact our support team immediately.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">Log In to Account</a>
    </div>
  `
  return getBaseTemplate({ title: 'Password Updated Successfully', contentHtml })
}

/**
 * 5. Welcome Email HTML
 */
export function getWelcomeEmail(name: string): string {
  const contentHtml = `
    <h2>Welcome to 2nd Inversion!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your email address has been verified successfully. Welcome to the 2nd Inversion Music School community! We are excited to support you on your musical journey.</p>
    <p>You can now log in to your dashboard to view schedules, access practice materials, and coordinate with your instructors.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">Go to Student Dashboard</a>
    </div>
  `
  return getBaseTemplate({ title: 'Welcome to 2nd Inversion Music School', contentHtml })
}

/**
 * 6. Trial Booking Confirmation Email HTML
 */
export function getTrialBookingConfirmationEmail(studentName: string, courseName: string, date: string, timeSlot: string): string {
  const contentHtml = `
    <h2>Trial Class Booking Received</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>Thank you for booking a trial class with us! We have received your request and will review the slot availability.</p>
    <div class="details-card">
      <div class="details-row"><strong>Instrument/Course:</strong> ${courseName}</div>
      <div class="details-row"><strong>Requested Date:</strong> ${date}</div>
      <div class="details-row"><strong>Time Slot:</strong> ${timeSlot}</div>
      <div class="details-row"><strong>Status:</strong> Pending Confirmation</div>
    </div>
    <p>We will contact you shortly to confirm your booking. If you need to make changes, please reply to this email.</p>
  `
  return getBaseTemplate({ title: 'Trial Class Booking Received', contentHtml })
}

/**
 * 7. Course Booking Confirmation Email HTML
 */
export function getCourseBookingConfirmationEmail(studentName: string, courseName: string, date: string, timeSlot: string, batchTiming: string): string {
  const contentHtml = `
    <h2>Course Booking Received</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>We have successfully received your booking request for the following course:</p>
    <div class="details-card">
      <div class="details-row"><strong>Course:</strong> ${courseName}</div>
      <div class="details-row"><strong>Preferred Date:</strong> ${date}</div>
      <div class="details-row"><strong>Preferred Slot:</strong> ${timeSlot} (${batchTiming} batch)</div>
      <div class="details-row"><strong>Status:</strong> Pending Approval</div>
    </div>
    <p>Our academic coordinators will verify the batch availability and update you within 24 hours.</p>
  `
  return getBaseTemplate({ title: 'Course Booking Request Received', contentHtml })
}

/**
 * 8. Booking Approved Email HTML
 */
export function getBookingApprovedEmail(studentName: string, courseName: string, date: string, timeSlot: string): string {
  const contentHtml = `
    <h2 style="color: #16a34a;">Booking Approved! 🎉</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>Great news! Your booking request for <strong>${courseName}</strong> has been approved by the school administrator.</p>
    <div class="details-card" style="border-left: 4px solid #16a34a;">
      <div class="details-row"><strong>Course/Instrument:</strong> ${courseName}</div>
      <div class="details-row"><strong>Scheduled Date:</strong> ${date}</div>
      <div class="details-row"><strong>Time Slot:</strong> ${timeSlot}</div>
      <div class="details-row"><strong>Status:</strong> Confirmed & Approved</div>
    </div>
    <p>Please log in to your Student Dashboard to access study guides, join live sessions, or view details.</p>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button" style="background-color: #16a34a;">Open Dashboard</a>
    </div>
  `
  return getBaseTemplate({ title: 'Booking Approved', contentHtml })
}

/**
 * 9. Booking Rejected Email HTML
 */
export function getBookingRejectedEmail(studentName: string, courseName: string, date: string, timeSlot: string): string {
  const contentHtml = `
    <h2 style="color: #dc2626;">Booking Request Declined</h2>
    <p>Hello <strong>${studentName}</strong>,</p>
    <p>We regret to inform you that we are unable to approve your booking request for <strong>${courseName}</strong> at the selected time.</p>
    <div class="details-card" style="border-left: 4px solid #dc2626;">
      <div class="details-row"><strong>Course/Instrument:</strong> ${courseName}</div>
      <div class="details-row"><strong>Date:</strong> ${date}</div>
      <div class="details-row"><strong>Time Slot:</strong> ${timeSlot}</div>
      <div class="details-row"><strong>Status:</strong> Declined / Cancelled</div>
    </div>
    <p>This is usually due to batch size limits or instructor scheduling conflicts. Please contact support or log in to select an alternative schedule.</p>
  `
  return getBaseTemplate({ title: 'Booking Request Declined', contentHtml })
}

/**
 * 10. Contact Form Confirmation Email HTML
 */
export function getContactFormConfirmationEmail(fullName: string, purpose: string, message: string, dateTime: string): string {
  const contentHtml = `
    <h2>Thank You for Contacting 2nd Inversion Musical School</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>Thank you for reaching out to us. We have successfully received your inquiry and our team is already reviewing it.</p>
    
    <div class="details-card">
      <h3 style="margin-top: 0; font-size: 14.5px; color: #0f1e4a;">Inquiry Summary</h3>
      <div class="details-row"><strong>Purpose:</strong> ${purpose}</div>
      <div class="details-row"><strong>Date & Time:</strong> ${dateTime}</div>
      <div class="details-row"><strong>Your Message:</strong></div>
      <p style="background: #ffffff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
    </div>

    <p><strong>Support Contact Information:</strong></p>
    <p>If you have any urgent questions, please feel free to call us at <strong>+91 77688 38832</strong> or email us at <strong>aamrule90@gmail.com</strong>.</p>
    <p>We look forward to helping you start or continue your musical journey!</p>
  `
  return getBaseTemplate({ title: 'Thank You for Contacting 2nd Inversion Musical School', contentHtml })
}

/**
 * 11. Admin Notification - New Student Registration
 */
export function getAdminNewStudentEmail(name: string, email: string): string {
  const contentHtml = `
    <h2>New Student Registered</h2>
    <p>An administrator notification alert: A new student has registered on the LMS platform.</p>
    <div class="details-card">
      <div class="details-row"><strong>Name:</strong> ${name}</div>
      <div class="details-row"><strong>Email:</strong> ${email}</div>
      <div class="details-row"><strong>Registration Date:</strong> ${new Date().toLocaleString()}</div>
      <div class="details-row"><strong>Verification Status:</strong> Pending Verification</div>
    </div>
  `
  return getBaseTemplate({ title: 'Admin Alert: New Student Registered', contentHtml })
}

/**
 * 12. Admin Notification - New Trial Booking
 */
export function getAdminNewTrialBookingEmail(studentName: string, studentEmail: string, courseName: string, date: string, timeSlot: string): string {
  const contentHtml = `
    <h2>New Trial Booking Request</h2>
    <p>An administrator notification alert: A new trial class has been requested.</p>
    <div class="details-card">
      <div class="details-row"><strong>Student Name:</strong> ${studentName}</div>
      <div class="details-row"><strong>Student Email:</strong> ${studentEmail}</div>
      <div class="details-row"><strong>Instrument/Course:</strong> ${courseName}</div>
      <div class="details-row"><strong>Requested Date:</strong> ${date}</div>
      <div class="details-row"><strong>Time Slot:</strong> ${timeSlot}</div>
    </div>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" class="button">Manage Bookings</a>
    </div>
  `
  return getBaseTemplate({ title: 'Admin Alert: New Trial Booking', contentHtml })
}

/**
 * 13. Admin Notification - New Course Booking
 */
export function getAdminNewCourseBookingEmail(studentName: string, studentEmail: string, courseName: string, date: string, timeSlot: string, batchTiming: string): string {
  const contentHtml = `
    <h2>New Course Booking Request</h2>
    <p>An administrator notification alert: A new batch booking has been requested.</p>
    <div class="details-card">
      <div class="details-row"><strong>Student Name:</strong> ${studentName}</div>
      <div class="details-row"><strong>Student Email:</strong> ${studentEmail}</div>
      <div class="details-row"><strong>Course:</strong> ${courseName}</div>
      <div class="details-row"><strong>Requested Date:</strong> ${date}</div>
      <div class="details-row"><strong>Preferred Slot:</strong> ${timeSlot} (${batchTiming})</div>
    </div>
    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" class="button">Manage Bookings</a>
    </div>
  `
  return getBaseTemplate({ title: 'Admin Alert: New Course Booking', contentHtml })
}

/**
 * 14. Admin Notification - New Contact Inquiry
 */
export function getAdminNewContactInquiryEmail(fullName: string, email: string, phone: string, purpose: string, message: string, dateTime: string, ipAddress?: string): string {
  const contentHtml = `
    <h2>New Contact Inquiry Submitted</h2>
    <p>An administrator notification alert: A visitor has submitted the contact form.</p>
    <div class="details-card">
      <div class="details-row"><strong>Name:</strong> ${fullName}</div>
      <div class="details-row"><strong>Email:</strong> ${email}</div>
      <div class="details-row"><strong>Phone Number:</strong> ${phone}</div>
      <div class="details-row"><strong>Purpose:</strong> ${purpose}</div>
      <div class="details-row"><strong>Date & Time:</strong> ${dateTime}</div>
      <div class="details-row"><strong>IP Address:</strong> ${ipAddress || 'Not available'}</div>
      <div class="details-row"><strong>Message:</strong></div>
      <p style="background: #ffffff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
    </div>
  `
  return getBaseTemplate({ title: 'Admin Alert: New Contact Inquiry', contentHtml })
}
