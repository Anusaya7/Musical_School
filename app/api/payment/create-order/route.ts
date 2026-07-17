import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export const dynamic = 'force-dynamic'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '1234567890'
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json()

    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Amount and currency are required' },
        { status: 400 }
      )
    }

    const options = {
      amount,
      currency,
      receipt,
      notes,
      payment_capture: 1
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
      amount: order.amount,
      currency: order.currency,
      id: order.id,
      notes: order.notes
    })

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
