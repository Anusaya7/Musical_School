import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { sendSystemEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const statusParam = searchParams.get('status')
    const studentIdParam = searchParams.get('studentId')

    const session = await auth()
    const isAdmin = (session?.user as any)?.role === 'SUPER_ADMIN' || (session?.user as any)?.role === 'ADMIN'

    const where: any = {}

    if (courseId) {
      where.courseId = courseId
    }

    if (studentIdParam) {
      // Students can fetch their own reviews (any status), otherwise it must be approved
      if (session?.user?.id === studentIdParam || isAdmin) {
        where.studentId = studentIdParam
      } else {
        where.studentId = studentIdParam
        where.status = 'APPROVED'
      }
    }

    // Apply status filter based on role permissions
    if (statusParam) {
      if (isAdmin) {
        where.status = statusParam
      } else {
        where.status = 'APPROVED'
      }
    } else if (!where.status && (!studentIdParam || session?.user?.id !== studentIdParam)) {
      // By default, public requests see only approved reviews
      where.status = 'APPROVED'
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        Course: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ success: true, reviews })
  } catch (error: any) {
    console.error('[REVIEWS GET API ERROR]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { courseId, rating, comment } = body

    if (!courseId || rating === undefined || !comment) {
      return NextResponse.json({ success: false, error: 'Course, rating, and comment are required fields.' }, { status: 400 })
    }

    const ratingVal = Number(rating)
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be a number between 1 and 5.' }, { status: 400 })
    }

    // 1. Verify student eligibility (must be enrolled / have paid)
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    const enrolledInUser = user?.enrolledCourses?.includes(courseId)

    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: session.user.id, courseId }
    })

    const payment = await prisma.payment.findFirst({
      where: { studentEmail: session.user.email!, courseId, status: 'Success' }
    })

    if (!enrolledInUser && !enrollment && !payment) {
      return NextResponse.json({
        success: false,
        error: 'Eligibility verification failed. You can only review courses you are enrolled in.'
      }, { status: 403 })
    }

    // 2. Check if a review already exists for this course by this student
    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already submitted a review for this course. You can edit your existing review instead.'
      }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true }
    })

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    // 3. Create review (defaults to PENDING)
    const review = await prisma.review.create({
      data: {
        courseId,
        studentId: session.user.id,
        rating: ratingVal,
        comment,
        status: 'PENDING'
      }
    })

    // 4. Create in-app admin notification
    try {
      await prisma.notification.create({
        data: {
          title: 'New Course Review',
          message: `${session.user.name} (${session.user.email}) submitted a review for ${course.title}.`
        }
      })
    } catch (notifErr) {
      console.error('[REVIEWS POST API] Failed to create in-app notification:', notifErr)
    }

    // 5. Dispatch admin email notification
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">New Student Review Submitted</h2>
          <p>A new student review is waiting for admin approval on the <strong>2nd Inversion Music School</strong> portal.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Student Name:</td>
              <td style="padding: 8px 0;">${session.user.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Student Email:</td>
              <td style="padding: 8px 0;">${session.user.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Course Name:</td>
              <td style="padding: 8px 0;">${course.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Rating:</td>
              <td style="padding: 8px 0; color: #fbbf24; font-size: 18px;">${'★'.repeat(ratingVal)}${'☆'.repeat(5 - ratingVal)} (${ratingVal}/5)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Comment:</td>
              <td style="padding: 8px 0; font-style: italic; background-color: #f9fafb; padding: 10px; border-radius: 4px;">"${comment}"</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Please log into the Admin Dashboard to approve or reject this review.</p>
        </div>
      `
      await sendSystemEmail(adminEmail, `[Review Alert] New Review for ${course.title}`, htmlContent)
    } catch (emailErr) {
      console.error('[REVIEWS POST API] Failed to dispatch admin notification email:', emailErr)
    }

    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    console.error('[REVIEWS POST API ERROR]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
