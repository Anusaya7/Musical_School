export async function sendWhatsAppNotification(
  recipientPhone: string,
  message: string
): Promise<{ success: boolean; simulated: boolean }> {
  const formattedPhone = recipientPhone.replace(/\D/g, '')

  console.log(`[WHATSAPP NOTIFICATION SERVICE]
Recipient: +${formattedPhone || '919876543210'}
Message Payload:
"${message}"
Timestamp: ${new Date().toISOString()}
Status: SENT (Simulated / Webhook Dispatch)
-----------------------------------------------`)

  return { success: true, simulated: true }
}
