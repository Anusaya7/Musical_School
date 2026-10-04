import { NextRequest, NextResponse } from 'next/server'
import { markOrderOutcome, PaymentError, requirePayer } from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requirePayer()
    const body = await request.json().catch(() => ({}))
    const orderId = String(body?.orderId || '')
    if (!orderId.startsWith('order_')) {
      return NextResponse.json({ success: false, error: 'Payment order was not found.' }, { status: 400 })
    }
    await markOrderOutcome({
      orderId,
      userEmail: user.email,
      status: 'CANCELLED',
      reason: 'Payment was cancelled'
    })
    return NextResponse.json({ success: true, status: 'CANCELLED' })
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'Unable to update the payment.' }, { status: 500 })
  }
}
