import { NextRequest, NextResponse } from 'next/server'
import { createPaymentOrder, PaymentError } from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Missing order fields.' }, { status: 400 })
    }
    const order = await createPaymentOrder({
      purchaseType: body?.purchaseType || body?.notes?.purchaseType,
      courseIds: body?.courseIds || body?.notes?.courseIds,
      courseId: body?.courseId || body?.notes?.courseId,
      plan: body?.plan || body?.notes?.plan,
      booking: body?.booking || {
        date: body?.notes?.date,
        timeSlot: body?.notes?.timeSlot,
        batchTiming: body?.notes?.batchTiming,
        instructor: body?.notes?.instructor,
        phone: body?.notes?.studentPhone || body?.phone
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('[PAYMENT] Order request failed')
    return NextResponse.json({ success: false, error: 'Unable to create the payment order.' }, { status: 500 })
  }
}
