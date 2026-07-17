import { NextResponse } from 'next/server'
import { getCourseByInstrumentAndLevel } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await getCourseByInstrumentAndLevel('piano', 'beginner')
    return NextResponse.json({ success: true, data: res })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack })
  }
}
