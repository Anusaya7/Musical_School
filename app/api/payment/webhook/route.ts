import { NextResponse } from 'next/server'
import { handleRazorpayWebhook, PaymentError } from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  try {
    const result = await handleRazorpayWebhook(rawBody, signature)
    return NextResponse.json({ status: 'ok', ...result })
  } catch (error) {
    if (error instanceof PaymentError) {
      if (error.status === 404) {
        return NextResponse.json({ status: 'ok', ignored: true })
      }
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('[WEBHOOK] Processing failed')
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
  }
}
