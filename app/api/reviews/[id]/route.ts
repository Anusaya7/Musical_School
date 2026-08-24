import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { sendSystemEmail } from '@/lib/email'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const { status, rating, comment } = body

    const existingReview = await prisma.review.findUnique({
      where: { id },
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
            title: true
          }
        }
      }
    })

    if (!existingReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }

    const isAdmin = (session.user as any).role === 'SUPER_ADMIN' || (session.user as any).role === 'ADMIN'
    const isOwner = session.user.id === existingReview.studentId

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const updateData: any = {}

    // Admin-only: updating status
    if (status !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ success: false, error: 'Only administrators can update the review status.' }, { status: 403 })
      }
      if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'PENDING') {
        return NextResponse.json({ success: false, error: 'Invalid review status.' }, { status: 400 })
      }
      updateData.status = status
    }

    // Owner-only: updating rating and comment
    if (rating !== undefined || comment !== undefined) {
      if (!isOwner) {
        return NextResponse.json({ success: false, error: 'Only the author of the review can modify its contents.' }, { status: 403 })
      }

      if (rating !== undefined) {
        const ratingVal = Number(rating)
        if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
          return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5.' }, { status: 400 })
        }
        updateData.rating = ratingVal
      }

      if (comment !== undefined) {
        if (!comment.trim()) {
          return NextResponse.json({ success: false, error: 'Comment content cannot be empty.' }, { status: 400 })
        }
        updateData.comment = comment
      }

      // Revert status to PENDING on edits
      updateData.status = 'PENDING'
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            name: true,
            email: true
          }
        },
        Course: {
          select: {
            title: true
          }
        }
      }
    })

    // Notify administrators if the review was updated by the student (reverted to PENDING)
    if (isOwner && (rating !== undefined || comment !== undefined)) {
      try {
        await prisma.notification.create({
          data: {
            title: 'Course Review Edited',
            message: `${session.user.name} edited their review for ${existingReview.Course.title} (Requires re-approval).`
          }
        })
      } catch (notifErr) {
        console.error('[REVIEW PATCH] Failed to create edit notification:', notifErr)
      }

      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'aamrule90@gmail.com'
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">Edited Review Submitted</h2>
            <p>Student <strong>${session.user.name}</strong> has edited their review for <strong>${existingReview.Course.title}</strong>.</p>
            <p>The review status has reverted to <strong>PENDING</strong> and requires administrative re-approval.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">New Rating:</td>
                <td style="padding: 8px 0; color: #fbbf24; font-size: 18px;">${'★'.repeat(updatedReview.rating)}${'☆'.repeat(5 - updatedReview.rating)} (${updatedReview.rating}/5)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">New Comment:</td>
                <td style="padding: 8px 0; font-style: italic; background-color: #f9fafb; padding: 10px; border-radius: 4px;">"${updatedReview.comment}"</td>
              </tr>
            </table>
          </div>
        `
        await sendSystemEmail(adminEmail, `[Review Edited] Re-approval Needed for ${existingReview.Course.title}`, htmlContent)
      } catch (emailErr) {
        console.error('[REVIEW PATCH] Failed to send admin edit notification email:', emailErr)
      }
    }

    // Notify the student if their review status was updated by an administrator
    if (isAdmin && status !== undefined) {
      try {
        const studentEmail = existingReview.student.email
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Review Update - 2nd Inversion</h2>
            <p>Hello ${existingReview.student.name},</p>
            <p>Your review for the course <strong>${existingReview.Course.title}</strong> has been <strong>${status.toLowerCase()}</strong> by our administrators.</p>
            ${status === 'APPROVED' 
              ? '<p style="color: #10b981; font-weight: bold;">Your review is now live on our course profile page! Thank you for sharing your experience.</p>' 
              : '<p style="color: #ef4444; font-weight: bold;">Unfortunately, your review was not approved for publication at this time.</p>'
            }
            <br/>
            <p style="font-size: 12px; color: #6b7280;">Warm regards,<br/>The 2nd Inversion Music School Team</p>
          </div>
        `
        await sendSystemEmail(studentEmail, `Your course review has been ${status.toLowerCase()}`, htmlContent)
      } catch (emailErr) {
        console.error('[REVIEW PATCH] Failed to send student status notification email:', emailErr)
      }
    }

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error: any) {
    console.error('[REVIEW PATCH ERROR]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const existingReview = await prisma.review.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }

    const isAdmin = (session.user as any).role === 'SUPER_ADMIN' || (session.user as any).role === 'ADMIN'
    const isOwner = session.user.id === existingReview.studentId

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await prisma.review.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Review deleted successfully.' })
  } catch (error: any) {
    console.error('[REVIEW DELETE ERROR]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
