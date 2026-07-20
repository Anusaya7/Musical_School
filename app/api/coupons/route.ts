import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (code) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
      })
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ success: false, error: 'Invalid or expired coupon' }, { status: 404 })
      }
      return NextResponse.json({ success: true, coupon })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, coupons })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, discountType, discountValue, minOrderAmount } = body

    if (!code || !discountValue) {
      return NextResponse.json({ success: false, error: 'Missing required coupon details' }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0
      }
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
