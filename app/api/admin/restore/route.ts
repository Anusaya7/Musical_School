import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ success: false, error: 'No backup data payload provided' }, { status: 400 })
    }

    let restoredCount = 0

    // Restore coupons if present
    if (Array.isArray(data.coupons)) {
      for (const coupon of data.coupons) {
        await prisma.coupon.upsert({
          where: { code: coupon.code },
          update: { ...coupon, updatedAt: undefined },
          create: coupon
        })
        restoredCount++
      }
    }

    // Restore students if present
    if (Array.isArray(data.students)) {
      for (const student of data.students) {
        await prisma.student.upsert({
          where: { email: student.email },
          update: { name: student.name, phone: student.phone, status: student.status },
          create: student
        })
        restoredCount++
      }
    }

    // Record Audit Log for Restore operation
    await prisma.auditLog.create({
      data: {
        userEmail: 'aamrule90@gmail.com',
        action: 'DATABASE_RESTORE',
        details: `Restored ${restoredCount} database records from backup file.`
      }
    })

    return NextResponse.json({
      success: true,
      message: `Database restored successfully. (${restoredCount} records processed)`
    })
  } catch (error: any) {
    console.error('Restore error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
