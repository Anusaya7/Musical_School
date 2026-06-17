import { NextResponse } from 'next/server'
import { getWorkshops, addWorkshop } from '@/lib/db'

export async function GET() {
  try {
    const workshops = await getWorkshops()
    return NextResponse.json(workshops)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, instructor, date, time, price, description } = body

    if (!title || !date || !time || typeof price !== 'number') {
      return NextResponse.json({ error: 'Missing required workshop fields' }, { status: 400 })
    }

    const id = `w-${Date.now()}`
    const workshop = {
      id,
      title,
      instructor: instructor || 'Ajinkya Amrule',
      date,
      time,
      price,
      description: description || ''
    }

    const success = await addWorkshop(workshop)
    if (success) {
      return NextResponse.json({ success: true, workshop })
    } else {
      return NextResponse.json({ error: 'Failed to add workshop' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
  }
}
