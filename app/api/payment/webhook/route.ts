import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

    if (signature) {
      if (!secret) {
        console.error('[WEBHOOK] Razorpay webhook secret is not configured!')
        return NextResponse.json({ success: false, error: 'Webhook secret missing' }, { status: 500 })
      }
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        console.warn('Razorpay webhook signature mismatch!')
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    if (event === 'payment.authorized' || event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity
      if (paymentEntity) {
        const orderId = paymentEntity.order_id
        const paymentId = paymentEntity.id
        const email = paymentEntity.email

        if (orderId) {
          await prisma.payment.updateMany({
            where: { orderId },
            data: { status: 'Success', paymentId }
          })

          await prisma.booking.updateMany({
            where: { orderId },
            data: { status: 'Confirmed', paymentStatus: 'Success', paymentId }
          })
        }

        await prisma.auditLog.create({
          data: {
            userEmail: email || 'system@razorpay',
            action: 'WEBHOOK_EVENT_PROCESSED',
            details: `Processed Razorpay Webhook Event: ${event} for Order ID: ${orderId || 'N/A'}`
          }
        })
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity
      if (paymentEntity) {
        const orderId = paymentEntity.order_id
        await prisma.payment.updateMany({
          where: { orderId },
          data: { status: 'Failed' }
        })
        await prisma.booking.updateMany({
          where: { orderId },
          data: { status: 'Failed', paymentStatus: 'Failed' }
        })
      }
    }

    return NextResponse.json({ status: 'ok', eventReceived: event })
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
