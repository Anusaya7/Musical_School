import { NextRequest, NextResponse } from 'next/server'
import { PaymentError, verifyAndFulfill } from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Missing payment fields.' }, { status: 400 })
    }
    const result = await verifyAndFulfill({
      razorpay_order_id: body?.razorpay_order_id,
      razorpay_payment_id: body?.razorpay_payment_id,
      razorpay_signature: body?.razorpay_signature
    })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('[PAYMENT] Verification request failed')
    return NextResponse.json({ success: false, error: 'Payment verification failed. No course access was granted.' }, { status: 500 })
  }
}
