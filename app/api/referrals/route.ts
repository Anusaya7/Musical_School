import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (email) {
      const referrals = await prisma.referral.findMany({
        where: { referrerEmail: email },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ success: true, referrals })
    }

    const all = await prisma.referral.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return NextResponse.json({ success: true, referrals: all })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { referrerEmail, referredEmail, code } = body

    if (!referrerEmail || !referredEmail) {
      return NextResponse.json({ success: false, error: 'Missing referral emails' }, { status: 400 })
    }

    const refCode = code || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const referral = await prisma.referral.create({
      data: {
        referrerEmail,
        referredEmail,
        code: refCode,
        status: 'PENDING',
        rewardAmount: 500
      }
    })

    return NextResponse.json({ success: true, referral })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
