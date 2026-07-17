import { NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/db'

export async function GET() {
  try {
    const logs = await getAuditLogs()
    // Sort logs by date descending (latest first)
    const sorted = [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json(sorted)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
