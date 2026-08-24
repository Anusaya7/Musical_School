import { NextResponse } from 'next/server'
import { getRecordedSessions, addRecordedSession, deleteRecordedSession, addAuditLog } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sessions = await getRecordedSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recorded sessions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, description, url, instrument, courseId } = body

    if (!title || !url || !instrument) {
      return NextResponse.json({ error: 'Title, URL, and instrument are required' }, { status: 400 })
    }

    const id = `v-${Date.now()}`
    const session = {
      id,
      title,
      description: description || '',
      url,
      instrument,
      courseId: courseId || undefined
    }

    const success = await addRecordedSession(session)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Recorded Session Added',
        details: `Published recorded session video: ${title} (${instrument})`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, session })
    } else {
      return NextResponse.json({ error: 'Failed to add recorded session' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save recorded session' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    const success = await deleteRecordedSession(id)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Recorded Session Deleted',
        details: `Deleted video session ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Recorded session video deleted successfully' })
    }
    return NextResponse.json({ error: 'Recorded session not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete recorded session' }, { status: 500 })
  }
}
