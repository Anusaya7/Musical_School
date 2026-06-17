import { NextResponse } from 'next/server'
import { getSchedules, updateSchedules } from '@/lib/db'

export async function GET() {
  try {
    const schedules = await getSchedules()
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Body should be an array of BatchSchedule
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid batch schedule array' }, { status: 400 })
    }

    const success = await updateSchedules(body)
    if (success) {
      return NextResponse.json({ success: true, schedules: body })
    } else {
      return NextResponse.json({ error: 'Failed to update schedules' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save schedules' }, { status: 500 })
  }
}
