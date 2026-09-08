import { NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const lowerEmail = email.trim().toLowerCase()
    console.log(`[AUTH-VALIDATION] Checking credentials for: ${lowerEmail}`)
    
    const user = await getUserByEmail(lowerEmail)
    if (!user) {
      console.log(`[AUTH-VALIDATION] Account not found: ${lowerEmail}`)
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 })
    }

    if (!user.passwordHash) {
      console.log(`[AUTH-VALIDATION] No password set: ${lowerEmail}`)
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      console.log(`[AUTH-VALIDATION] Incorrect password: ${lowerEmail}`)
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 })
    }

    console.log(`[AUTH-VALIDATION] Successful match for: ${lowerEmail}, role: ${user.role}`)
    return NextResponse.json({ success: true, role: user.role, name: user.name })
  } catch (error: any) {
    console.error('[AUTH-VALIDATION] Error during validation:', error)
    return NextResponse.json({ success: false, error: 'Unable to sign in right now. Please try again.' }, { status: 500 })
  }
}
