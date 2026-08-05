/**
 * WhatsApp Business Cloud API Service Layer
 * 
 * Configured via .env:
 * - WHATSAPP_API_TOKEN
 * - WHATSAPP_PHONE_NUMBER_ID
 */
export class WhatsAppService {
  private static getCredentials() {
    const token = process.env.WHATSAPP_API_TOKEN
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
    return { token, phoneId }
  }

  /**
   * Cleans a phone number to only contain digits (e.g. "+91 77688 38832" -> "917768838832")
   */
  private static cleanPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    // Default to adding 91 if it's a 10 digit Indian number without country code
    if (digits.length === 10) {
      return '91' + digits
    }
    return digits
  }

  /**
   * Sends a plain text WhatsApp message or template message.
   */
  static async sendMessage(to: string, text: string): Promise<boolean> {
    const { token, phoneId } = this.getCredentials()
    const cleanPhone = this.cleanPhoneNumber(to)

    if (!token || !phoneId) {
      console.log(`[WHATSAPP SYSTEM FALLBACK - NO WHATSAPP CONFIG]
To: ${cleanPhone}
Message: ${text}
------------------------------------------`)
      return true
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: text
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[WHATSAPP SYSTEM] Sent WhatsApp message to ${cleanPhone} successfully. Msg ID: ${data.messages?.[0]?.id}`)
        return true
      } else {
        const errorData = await response.json()
        console.error(`[WHATSAPP SYSTEM ERROR] Failed to send WhatsApp to ${cleanPhone}:`, errorData)
        return false
      }
    } catch (err) {
      console.error(`[WHATSAPP SYSTEM ERROR] Network/request exception sending to ${cleanPhone}:`, err)
      return false
    }
  }

  /**
   * Sends a structured template message (preferred for initiating business chats).
   */
  static async sendTemplate(to: string, templateName: string, languageCode = 'en', components: any[] = []): Promise<boolean> {
    const { token, phoneId } = this.getCredentials()
    const cleanPhone = this.cleanPhoneNumber(to)

    if (!token || !phoneId) {
      console.log(`[WHATSAPP TEMPLATE FALLBACK - NO WHATSAPP CONFIG]
To: ${cleanPhone}
Template: ${templateName} (${languageCode})
Components: ${JSON.stringify(components, null, 2)}
------------------------------------------`)
      return true
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode
            },
            components
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[WHATSAPP SYSTEM] Sent WhatsApp template "${templateName}" to ${cleanPhone} successfully. Msg ID: ${data.messages?.[0]?.id}`)
        return true
      } else {
        const errorData = await response.json()
        console.error(`[WHATSAPP SYSTEM ERROR] Failed to send WhatsApp template "${templateName}" to ${cleanPhone}:`, errorData)
        return false
      }
    } catch (err) {
      console.error(`[WHATSAPP SYSTEM ERROR] Network exception sending template to ${cleanPhone}:`, err)
      return false
    }
  }
}
