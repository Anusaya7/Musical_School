import { NextResponse } from 'next/server'
import { getPayments } from '@/lib/db'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = String((session?.user as { role?: string })?.role || '').toUpperCase()

  try {
    let payments = await getPayments()
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      payments = payments.filter(payment => payment.studentEmail?.toLowerCase() === email)
    }
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json([], { status: 500 })
  }
}
