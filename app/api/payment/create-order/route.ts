import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let bodyData: any = {}
  try {
    bodyData = await request.json()
    const { amount, currency = 'INR', receipt, notes } = bodyData

    let parsedAmount = Math.round(Number(amount))
    const courseId = notes?.courseId || bodyData?.courseId
    const courseIds = notes?.courseIds || bodyData?.courseIds
    const purchaseType = notes?.purchaseType || bodyData?.purchaseType
    const planType = notes?.plan || bodyData?.plan

    // Secure price calculation on the server side (never trust client amount)
    if (purchaseType === 'plan' || planType) {
      const planStr = String(planType || '').toLowerCase()
      if (planStr.includes('lifetime')) {
        parsedAmount = 999900 // ₹9,999 in paise
      } else if (planStr.includes('yearly') || planStr.includes('1-year') || planStr.includes('pro')) {
        parsedAmount = 299900 // ₹2,999 in paise
      }
    } else if (courseIds && Array.isArray(courseIds)) {
      const coursesRecord = await prisma.course.findMany({
        where: { id: { in: courseIds } }
      })
      if (coursesRecord.length === 0) {
        return NextResponse.json(
          { success: false, error: 'None of the requested courses exist' },
          { status: 404 }
        )
      }
      const dbTotal = coursesRecord.reduce((sum, c) => sum + c.price, 0)
      parsedAmount = Math.round(dbTotal * 100)
    } else if (courseId) {
      const courseRecord = await prisma.course.findUnique({
        where: { id: courseId }
      })
      if (!courseRecord) {
        return NextResponse.json(
          { success: false, error: 'The requested course does not exist' },
          { status: 404 }
        )
      }
      
      const isTrial = notes?.purchaseType === 'booking' && (parsedAmount === 0 || !amount)
      if (!isTrial) {
        parsedAmount = Math.round(courseRecord.price * 100)
      }
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive integer in paise (e.g. 350000 for ₹3500)' },
        { status: 400 }
      )
    }

    const receiptId = receipt || `rcpt_${Date.now()}`

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Check if configuration credentials are empty or placeholders
    const isKeysPlaceholder =
      !keyId ||
      !keySecret ||
      keyId.includes('your_key') ||
      keyId === 'rzp_test_your_key_here' ||
      keySecret.includes('your_razorpay') ||
      keySecret === 'your_razorpay_secret_key' ||
      keySecret === 'abc123xyzSecretKeyHere';

    if (isKeysPlaceholder) {
      console.error('[PAYMENT] Razorpay credentials are not configured or are placeholders!')
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay Test Mode is not configured. Please configure your actual Razorpay test credentials in environment variables.'
        },
        { status: 500 }
      )
    }

    console.log('Creating Real Razorpay Order:', {
      amount: parsedAmount,
      currency,
      receipt: receiptId,
      notes
    })

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
