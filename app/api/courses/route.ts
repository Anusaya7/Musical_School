import { NextResponse } from 'next/server'
import { getCourses, updateCoursePrice } from '@/lib/db'

export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, price } = body
    if (!id || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid course ID or price' }, { status: 400 })
    }
    const success = await updateCoursePrice(id, price)
    if (success) {
      return NextResponse.json({ success: true, message: 'Price updated successfully' })
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course price' }, { status: 500 })
  }
}
