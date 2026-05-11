import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Test key - replace with actual key
  key_secret: process.env.RAZORPAY_KEY_SECRET || '1234567890' // Test secret - replace with actual secret
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
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes,
      payment_capture: 1
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
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
