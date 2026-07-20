import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const where: any = {}
    if (courseId) where.courseId = courseId

    const classes = await prisma.liveClass.findMany({
      where,
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json({ success: true, liveClasses: classes })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, courseId, instructorId, platform, joinUrl, startTime, durationMins } = body

    if (!title || !courseId || !joinUrl || !startTime) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const newClass = await prisma.liveClass.create({
      data: {
        title,
        courseId,
        instructorId: instructorId || 'inst-1',
        platform: platform || 'Zoom',
        joinUrl,
        startTime: new Date(startTime),
        durationMins: durationMins ? parseInt(durationMins) : 60
      }
    })

    return NextResponse.json({ success: true, liveClass: newClass })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
