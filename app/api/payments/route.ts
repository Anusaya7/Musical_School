import { NextResponse } from 'next/server'
import { getPayments } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payments = await getPayments()
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments list:', error)
    return NextResponse.json([], { status: 500 })
  }
}
