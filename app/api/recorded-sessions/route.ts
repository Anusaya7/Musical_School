import { NextResponse } from 'next/server'
import { getRecordedSessions, addRecordedSession } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await getRecordedSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recorded sessions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, url, instrument } = body

    if (!title || !url || !instrument) {
      return NextResponse.json({ error: 'Title, URL, and instrument are required' }, { status: 400 })
    }

    const id = `v-${Date.now()}`
    const session = {
      id,
      title,
      description: description || '',
      url,
      instrument
    }

    const success = await addRecordedSession(session)
    if (success) {
      return NextResponse.json({ success: true, session })
    } else {
      return NextResponse.json({ error: 'Failed to add recorded session' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save recorded session' }, { status: 500 })
  }
}
