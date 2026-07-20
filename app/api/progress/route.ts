import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    if (!email) {
      return NextResponse.json({ success: false, error: 'Student email required' }, { status: 400 })
    }

    if (courseId) {
      const progress = await prisma.courseProgress.findUnique({
        where: {
          studentEmail_courseId: { studentEmail: email, courseId }
        }
      })
      return NextResponse.json({ success: true, progress: progress || { completedLessons: 0, totalLessons: 10, progressPercent: 0 } })
    }

    const allProgress = await prisma.courseProgress.findMany({
      where: { studentEmail: email }
    })

    return NextResponse.json({ success: true, progressList: allProgress })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentEmail, courseId, completedLessons, totalLessons } = body

    if (!studentEmail || !courseId) {
      return NextResponse.json({ success: false, error: 'Missing required progress data' }, { status: 400 })
    }

    const total = totalLessons || 10
    const completed = Math.min(completedLessons || 1, total)
    const percent = Math.round((completed / total) * 100)

    const progress = await prisma.courseProgress.upsert({
      where: {
        studentEmail_courseId: { studentEmail, courseId }
      },
      update: {
        completedLessons: completed,
        totalLessons: total,
        progressPercent: percent
      },
      create: {
        studentEmail,
        courseId,
        completedLessons: completed,
        totalLessons: total,
        progressPercent: percent
      }
    })

    return NextResponse.json({ success: true, progress })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
