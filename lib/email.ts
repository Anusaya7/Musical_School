import nodemailer from 'nodemailer'

// Re-export all email templates
export * from './email-templates'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM
  const admin = process.env.ADMIN_EMAIL

  if (!host || !user || !pass || !from || !admin) {
    const missing = []
    if (!host) missing.push('SMTP_HOST')
    if (!user) missing.push('SMTP_USER')
    if (!pass) missing.push('SMTP_PASS/SMTP_PASSWORD')
    if (!from) missing.push('SMTP_FROM')
    if (!admin) missing.push('ADMIN_EMAIL')
    throw new Error(`SMTP configuration missing required variables: ${missing.join(', ')}`)
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  })
}

/**
 * Verifies the SMTP connection parameters.
 */
export async function verifySMTPConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    return { success: true, message: 'SMTP connection verified successfully!' }
  } catch (error: any) {
    console.error('[EMAIL SYSTEM ERROR] SMTP verify failed:', error)
    return { success: false, message: error.message || 'SMTP authentication or connection failed.' }
  }
}

export async function sendSystemEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  try {
    const transporter = getTransporter()
    const fromEmail = process.env.SMTP_FROM!

    // 1. Verify SMTP connection before sending
    await transporter.verify()

    // 2. Dispatch Email
    await transporter.sendMail({
      from: fromEmail.includes('<') ? fromEmail : `"2nd Inversion Music School" <${fromEmail}>`,
      to,
      subject,
      html: htmlContent
    })
    console.log(`[EMAIL SYSTEM] Sent email to ${to} with subject "${subject}" successfully.`)
    return true
  } catch (err: any) {
    console.error(`[EMAIL SYSTEM ERROR] Failed to send email to ${to}:`, err)
    throw err
  }
}
