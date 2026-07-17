import { NextResponse } from 'next/server'
import { getUsers, updateUserStatus, deleteUser, addAuditLog } from '@/lib/db'

export async function GET() {
  try {
    const users = await getUsers()
    const students = users.filter(u => u.role === 'STUDENT')
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { email, status } = body
    if (!email || !status) {
      return NextResponse.json({ error: 'Missing email or status' }, { status: 400 })
    }

    const success = await updateUserStatus(email, status)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Student Updated',
        details: `Updated status of student ${email} to ${status}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: `Status updated successfully to ${status}` })
    }
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student status' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Missing student email' }, { status: 400 })
    }

    const success = await deleteUser(email)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Student Deleted',
        details: `Deleted student account: ${email}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Student account deleted successfully' })
    }
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
