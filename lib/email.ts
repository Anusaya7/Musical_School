import { Resend } from 'resend'

// Re-export all email templates
export * from './email-templates'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

/**
 * Resend only allows sending from a verified domain, or their test address:
 * onboarding@resend.dev
 * After you verify 2ndinversion.com in Resend, set RESEND_FROM to e.g.
 * "2nd Inversion Music School <noreply@2ndinversion.com>"
 */
function getFromAddress() {
  const configured =
    process.env.RESEND_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim()

  // Gmail addresses are not valid Resend "from" without a verified domain.
  if (
    configured &&
    !/@gmail\.com$/i.test(configured.replace(/.*</, '').replace(/>.*/, '').trim()) &&
    !configured.includes('your_')
  ) {
    return configured.includes('<')
      ? configured
      : `"2nd Inversion Music School" <${configured}>`
  }

  return '2nd Inversion Music School <onboarding@resend.dev>'
}

/**
 * Verifies Resend API key is present and usable.
 */
export async function verifySMTPConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY?.trim()
    if (!apiKey) {
      return { success: false, message: 'RESEND_API_KEY is missing' }
    }
    if (!apiKey.startsWith('re_')) {
      return { success: false, message: 'RESEND_API_KEY looks invalid (should start with re_)' }
    }
    // Lightweight check — Resend has no dedicated verify endpoint; key presence is enough here.
    getResendClient()
    return {
      success: true,
      message: `Resend configured. From: ${getFromAddress()}`
    }
  } catch (error: any) {
    console.error('[EMAIL SYSTEM ERROR] Resend verify failed:', error)
    return { success: false, message: error.message || 'Resend configuration failed.' }
  }
}

export async function sendSystemEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  try {
    const resend = getResendClient()
    const from = getFromAddress()

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html: htmlContent
    })

    if (error) {
      console.error(`[EMAIL SYSTEM ERROR] Resend rejected send to ${to}:`, error)
      throw new Error(error.message || 'Resend failed to send email')
    }

    console.log(`[EMAIL SYSTEM] Sent email to ${to} via Resend (id: ${data?.id || 'n/a'}) subject "${subject}"`)
    return true
  } catch (err: any) {
    console.error(`[EMAIL SYSTEM ERROR] Failed to send email to ${to}:`, err)
    throw err
  }
}
