import { NextRequest, NextResponse } from 'next/server'
import { getPayments } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    let payments = await getPayments()
    if (email) {
      payments = payments.filter(p => p.studentEmail?.toLowerCase() === email.toLowerCase())
    }

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json([], { status: 500 })
  }
}
