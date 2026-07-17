import nodemailer from 'nodemailer'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
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

export async function sendSystemEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  const transporter = getTransporter()
  const fromEmail = process.env.SMTP_USER || 'no-reply@2ndinversion.com'

  if (!transporter) {
    console.log(`[EMAIL SYSTEM FALLBACK - NO SMTP CONFIG]
To: ${to}
Subject: ${subject}
Content:
${htmlContent}
------------------------------------------`)
    return true
  }

  try {
    await transporter.sendMail({
      from: `"2nd Inversion Music School" <${fromEmail}>`,
      to,
      subject,
      html: htmlContent
    })
    console.log(`[EMAIL SYSTEM] Sent email to ${to} with subject "${subject}" successfully.`)
    return true
  } catch (err) {
    console.error(`[EMAIL SYSTEM ERROR] Failed to send email to ${to}:`, err)
    return false
  }
}
