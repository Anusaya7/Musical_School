import { NextResponse } from 'next/server'
import { getInstructors, addInstructor, updateInstructor, deleteInstructor, addAuditLog } from '@/lib/db'

export async function GET() {
  try {
    const instructors = await getInstructors()
    return NextResponse.json(instructors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, expertise, avatar } = body

    if (!name || !email || !expertise) {
      return NextResponse.json({ error: 'Name, email, and expertise are required fields' }, { status: 400 })
    }

    const id = `inst-${Date.now()}`
    const inst = {
      id,
      name,
      email,
      expertise,
      rating: 5.0,
      students: 0,
      avatar: avatar || name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      isActive: true
    }

    const success = await addInstructor(inst)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Instructor Added',
        details: `Added new instructor: ${name} (${email})`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, instructor: inst })
    }
    return NextResponse.json({ error: 'Failed to save instructor' }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add instructor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, email, expertise, avatar, isActive, photo, resume, certificates } = body

    if (!id || !name || !email || !expertise) {
      return NextResponse.json({ error: 'Missing required instructor attributes' }, { status: 400 })
    }

    const inst = {
      id,
      name,
      email,
      expertise,
      rating: 5.0,
      students: 0,
      avatar: avatar || name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      isActive: isActive !== undefined ? isActive : true,
      photo,
      resume,
      certificates
    }

    const success = await updateInstructor(inst)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Instructor Updated',
        details: `Updated instructor details for ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, instructor: inst })
    }
    return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update instructor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing instructor ID' }, { status: 400 })
    }

    const success = await deleteInstructor(id)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Instructor Deleted',
        details: `Deleted instructor ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Instructor deleted successfully' })
    }
    return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 })
  }
}
