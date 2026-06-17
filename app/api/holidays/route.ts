import { NextResponse } from 'next/server'
import { getHolidays, addHoliday, deleteHoliday } from '@/lib/db'

export async function GET() {
  try {
    const holidays = await getHolidays()
    return NextResponse.json(holidays)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, reason, isRecurringWeekly, dayOfWeek } = body
    
    if (isRecurringWeekly && typeof dayOfWeek !== 'number') {
      return NextResponse.json({ error: 'Day of week is required for recurring weekly holiday' }, { status: 400 })
    }
    if (!isRecurringWeekly && !date) {
      return NextResponse.json({ error: 'Date is required for single holiday' }, { status: 400 })
    }

    const id = `h-${Date.now()}`
    const holiday = {
      id,
      date: date || '',
      reason: reason || 'Holiday',
      isRecurringWeekly: !!isRecurringWeekly,
      dayOfWeek: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined
    }

    const success = await addHoliday(holiday)
    if (success) {
      return NextResponse.json({ success: true, holiday })
    } else {
      return NextResponse.json({ error: 'Failed to add holiday to database' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add holiday' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Holiday ID is required' }, { status: 400 })
    }
    const success = await deleteHoliday(id)
    if (success) {
      return NextResponse.json({ success: true, message: 'Holiday deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete holiday' }, { status: 500 })
  }
}
