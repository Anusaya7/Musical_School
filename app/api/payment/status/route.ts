import { NextRequest, NextResponse } from 'next/server'
import { getOwnedPaymentStatus, PaymentError } from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId') || ''
    if (!orderId.startsWith('order_')) {
      return NextResponse.json({ success: false, error: 'Payment order was not found.' }, { status: 400 })
    }
    const status = await getOwnedPaymentStatus(orderId)
    return NextResponse.json(status)
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    return NextResponse.json({ success: false, error: 'Unable to load the payment.' }, { status: 500 })
  }
}
