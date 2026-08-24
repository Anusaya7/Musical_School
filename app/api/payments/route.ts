import { NextResponse } from 'next/server'
import { getPayments } from '@/lib/db'

import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payments = await getPayments()
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments list:', error)
    return NextResponse.json([], { status: 500 })
  }
}
