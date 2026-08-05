import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export const dynamic = 'force-dynamic'

function isMockMode() {
  if (process.env.NODE_ENV === 'production') {
    return false
  }
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  return (
    !keyId ||
    !keySecret ||
    keyId.includes('your_key') ||
    keyId === 'rzp_test_your_key_here' ||
    keySecret.includes('your_razorpay') ||
    keySecret === 'your_razorpay_secret_key'
  )
}

export async function POST(request: NextRequest) {
  let bodyData: any = {}
  try {
    bodyData = await request.json()
    const { amount, currency = 'INR', receipt, notes } = bodyData

    const parsedAmount = Math.round(Number(amount))

    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive integer in paise (e.g. 499900 for ₹4999)' },
        { status: 400 }
      )
    }

    const receiptId = receipt || `rcpt_${Date.now()}`

    console.log('Creating Razorpay Order:', {
      amount: parsedAmount,
      currency,
      receipt: receiptId,
      notes
    })

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (isMockMode()) {
      console.log('[RAZORPAY MOCK MODE] Creating simulated order for receipt:', receiptId)
      return NextResponse.json({
        success: true,
        key: keyId,
        amount: parsedAmount,
        currency,
        id: `order_mock_${Date.now()}`,
        notes,
        isMock: true
      })
    }

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      })

      const options = {
        amount: parsedAmount,
        currency,
        receipt: receiptId,
        notes: notes || {},
        payment_capture: 1
      }

      const order = await razorpay.orders.create(options)
      console.log('Razorpay Order Created Successfully:', order)

      return NextResponse.json({
        success: true,
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        id: order.id,
        notes: order.notes
      })
    } catch (apiError: any) {
      console.error('[RAZORPAY API ERROR DETAILED]', {
        statusCode: apiError?.statusCode,
        error: apiError?.error,
        description: apiError?.error?.description || apiError?.description || apiError?.message,
        reason: apiError?.reason,
        message: apiError?.message,
        stack: apiError?.stack
      })

      const detailedMessage =
        apiError?.error?.description ||
        apiError?.description ||
        apiError?.message ||
        (typeof apiError === 'object' ? JSON.stringify(apiError) : String(apiError))

      // Fallback to test mode order if Razorpay returns authentication error for placeholder credentials
      if (
        process.env.NODE_ENV !== 'production' &&
        (detailedMessage.includes('Authentication failed') ||
         detailedMessage.includes('BAD_REQUEST_ERROR') ||
         apiError?.statusCode === 401)
      ) {
        console.log('[RAZORPAY FALLBACK] Authentication failed with provided keys, returning test order for local testing.')
        return NextResponse.json({
          success: true,
          key: keyId,
          amount: parsedAmount,
          currency,
          id: `order_mock_${Date.now()}`,
          notes,
          isMock: true
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: `Razorpay Order Creation Failed: ${detailedMessage}`,
          details: apiError?.error || null,
          stack: apiError?.stack
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[RAZORPAY REQUEST ERROR]', error)
    const errText = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error))
    return NextResponse.json(
      {
        success: false,
        error: `Razorpay Order Request Failed: ${errText}`,
        stack: error?.stack
      },
      { status: 500 }
    )
  }
}
