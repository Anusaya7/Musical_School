import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

    if (!signature) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[WEBHOOK] Rejecting unsigned webhook request in production.')
        return NextResponse.json({ success: false, error: 'Signature missing' }, { status: 400 })
      }
      console.log('[WEBHOOK] Bypassing signature check for unsigned webhook in development mode.')
    } else {
      if (!secret) {
        console.error('[WEBHOOK] Razorpay webhook secret is not configured!')
        return NextResponse.json({ success: false, error: 'Webhook secret missing' }, { status: 500 })
      }
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        console.warn('Razorpay webhook signature mismatch! Logged for security audit.')
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity
      if (paymentEntity) {
        const orderId = paymentEntity.order_id
        const paymentId = paymentEntity.id
        const email = paymentEntity.email

        // Update payment status in database
        if (orderId) {
          await prisma.payment.updateMany({
            where: { orderId },
            data: { status: 'Success', paymentId }
          })

          await prisma.booking.updateMany({
            where: { orderId },
            data: { status: 'Booked', paymentStatus: 'SUCCESS', paymentId }
          })
        }

        // Add audit log
        await prisma.auditLog.create({
          data: {
            userEmail: email || 'system@razorpay',
            action: 'WEBHOOK_PAYMENT_CAPTURED',
            details: `Webhook payment captured. Order ID: ${orderId}, Payment ID: ${paymentId}`
          }
        })
      }
    }

    return NextResponse.json({ status: 'ok', received: true })
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
