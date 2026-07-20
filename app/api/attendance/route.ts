import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    const where: any = {}
    if (email) where.studentEmail = email
    if (courseId) where.courseId = courseId

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, attendance: records })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentEmail, courseId, date, status } = body

    if (!studentEmail || !courseId || !date) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const record = await prisma.attendance.create({
      data: {
        studentEmail,
        courseId,
        date,
        status: status || 'PRESENT'
      }
    })

    return NextResponse.json({ success: true, attendance: record })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
