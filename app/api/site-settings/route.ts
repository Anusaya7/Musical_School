import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSiteSettings, updateSiteSetting } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to get site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Check authentication and role authorization
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    
    const role = (session.user as any).role?.toUpperCase()
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 })
    }

    const { key, value } = await request.json()
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value parameters are required' }, { status: 400 })
    }

    const success = await updateSiteSetting(key, value)
    if (success) {
      return NextResponse.json({ success: true, message: `Site setting '${key}' updated successfully` })
    }
    return NextResponse.json({ error: 'Failed to update setting in database' }, { status: 500 })
  } catch (error) {
    console.error('Failed to save site setting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
