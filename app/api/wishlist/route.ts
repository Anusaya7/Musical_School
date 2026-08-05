import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    return NextResponse.json({
      success: true,
      wishlist: ['piano-masterclass', 'guitar-shred-pro']
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { courseId, action } = body

    return NextResponse.json({
      success: true,
      message: `Course ${action === 'remove' ? 'removed from' : 'added to'} wishlist`
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
