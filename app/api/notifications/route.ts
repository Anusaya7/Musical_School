import { NextResponse } from 'next/server'
import { getNotifications, markNotificationsAsRead, deleteNotification } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const notifications = await getNotifications()
    // Sort by newest first
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    const unreadCount = notifications.filter(n => !n.isRead).length
    
    return NextResponse.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Failed to fetch notifications API error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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
    const { ids } = body // Optional list of IDs to mark as read, if omitted marks all

    const success = await markNotificationsAsRead(ids)
    if (success) {
      return NextResponse.json({ success: true, message: 'Notifications marked as read' })
    } else {
      return NextResponse.json({ error: 'No notifications updated' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to update notifications:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
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
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    const success = await deleteNotification(id)
    if (success) {
      return NextResponse.json({ success: true, message: 'Notification deleted' })
    } else {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to delete notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
}
