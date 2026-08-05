import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const reviews = await prisma.review.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, reviews })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { courseId, name, rating, comment } = body

    if (!courseId || !name || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        courseId,
        name,
        rating: Number(rating),
        comment
      }
    })

    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
