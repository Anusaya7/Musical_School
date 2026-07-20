import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const studentEmail = searchParams.get('studentEmail')

    if (studentEmail) {
      const submissions = await prisma.submission.findMany({
        where: { studentEmail },
        include: { assignment: true },
        orderBy: { submittedAt: 'desc' }
      })
      return NextResponse.json({ success: true, submissions })
    }

    const assignments = await prisma.assignment.findMany({
      where: courseId ? { courseId } : {},
      include: { submissions: true },
      orderBy: { dueDate: 'asc' }
    })

    return NextResponse.json({ success: true, assignments })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, title, courseId, dueDate, description, assignmentId, studentEmail, fileUrl, score, feedback } = body

    if (type === 'submit') {
      if (!assignmentId || !studentEmail || !fileUrl) {
        return NextResponse.json({ success: false, error: 'Missing submission details' }, { status: 400 })
      }
      const submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentEmail,
          fileUrl,
          status: 'Submitted'
        }
      })
      return NextResponse.json({ success: true, submission })
    }

    if (type === 'grade') {
      if (!assignmentId || !studentEmail) {
        return NextResponse.json({ success: false, error: 'Missing grading details' }, { status: 400 })
      }
      const existing = await prisma.submission.findFirst({
        where: { assignmentId, studentEmail }
      })
      if (existing) {
        const updated = await prisma.submission.update({
          where: { id: existing.id },
          data: {
            score: score !== undefined ? parseInt(score) : undefined,
            feedback: feedback || undefined,
            status: 'Graded'
          }
        })
        return NextResponse.json({ success: true, submission: updated })
      }
    }

    if (!title || !courseId || !dueDate) {
      return NextResponse.json({ success: false, error: 'Missing required assignment fields' }, { status: 400 })
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        courseId,
        dueDate: new Date(dueDate),
        description: description || 'Complete the assignment guidelines.'
      }
    })

    return NextResponse.json({ success: true, assignment: newAssignment })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
