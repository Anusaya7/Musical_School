import { NextResponse } from 'next/server'
import { getNotifications, markNotificationsAsRead, deleteNotification } from '@/lib/db'

export async function GET() {
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
