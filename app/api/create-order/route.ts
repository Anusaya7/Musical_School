import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890'
const keySecret = process.env.RAZORPAY_KEY_SECRET || '1234567890'

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
})

function isMockMode() {
  return !process.env.RAZORPAY_KEY_ID || 
         process.env.RAZORPAY_KEY_ID.includes('your_key') || 
         process.env.RAZORPAY_KEY_ID === 'rzp_test_1234567890' ||
         !process.env.RAZORPAY_KEY_SECRET ||
         process.env.RAZORPAY_KEY_SECRET.includes('your_razorpay')
}

export async function POST(request: NextRequest) {
  let bodyData: any = {}
  try {
    bodyData = await request.json()
    const { amount, currency, receipt, notes } = bodyData

    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Amount and currency are required' },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log('[RAZORPAY MOCK MODE] Creating simulated order for receipt:', receipt)
      return NextResponse.json({
        success: true,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount,
        currency,
        id: `order_mock_${Date.now()}`,
        notes,
        isMock: true
      })
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

  } catch (error: any) {
    console.error('[RAZORPAY ORDER ERROR] Failed to create Razorpay order:', error)
    console.error('Request Body:', bodyData)
    console.error('Stack Trace:', error?.stack)

    const errMsg = process.env.NODE_ENV === 'development' || isMockMode()
      ? `Razorpay Order Creation Failed: ${error?.message || error}`
      : 'Failed to create payment order'

    return NextResponse.json(
      { success: false, error: errMsg, stack: error?.stack },
      { status: 500 }
    )
  }
}
