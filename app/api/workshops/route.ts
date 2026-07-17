import { NextResponse } from 'next/server'
import { getWorkshops, addWorkshop, updateWorkshop, deleteWorkshop, addAuditLog } from '@/lib/db'

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

    if (!title || !date || !time || price === undefined) {
      return NextResponse.json({ error: 'Missing required workshop fields' }, { status: 400 })
    }

    const id = `w-${Date.now()}`
    const workshop = {
      id,
      title,
      instructor: instructor || 'Ajinkya Amrule',
      date,
      time,
      price: Number(price),
      description: description || ''
    }

    const success = await addWorkshop(workshop)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Workshop Added',
        details: `Added new workshop: ${title} on ${date}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, workshop })
    } else {
      return NextResponse.json({ error: 'Failed to add workshop' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, instructor, date, time, price, description } = body

    if (!id || !title || !date || !time || price === undefined) {
      return NextResponse.json({ error: 'Missing required workshop fields' }, { status: 400 })
    }

    const workshop = {
      id,
      title,
      instructor: instructor || 'Ajinkya Amrule',
      date,
      time,
      price: Number(price),
      description: description || ''
    }

    const success = await updateWorkshop(workshop)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Workshop Updated',
        details: `Updated details for workshop: ${title}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, workshop })
    } else {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing workshop ID' }, { status: 400 })
    }

    const success = await deleteWorkshop(id)
    if (success) {
      // Log audit activity
      await addAuditLog({
        id: `log-${Date.now()}`,
        userEmail: 'admin@2ndinversion.com',
        action: 'Workshop Deleted',
        details: `Deleted workshop ID: ${id}`,
        createdAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true, message: 'Workshop deleted successfully' })
    }
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 })
  }
}
