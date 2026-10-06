import { NextResponse } from 'next/server'
import { getInquiries, addInquiry, updateInquiryStatus, deleteInquiry, addNotification } from '@/lib/db'
import { sendSystemEmail, getContactFormConfirmationEmail, getAdminNewContactInquiryEmail } from '@/lib/email'
import { WhatsAppService } from '@/lib/services/whatsapp'
import { auth } from '@/auth'

// Basic input sanitization to prevent XSS
function sanitize(input: string): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Validation helpers
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePhone = (phone: string) => {
  // Matches basic international or 10-digit formats (e.g., +917768838832, 9876543210, etc.)
  const re = /^\+?[0-9\s\-()]{10,20}$/
  return re.test(phone)
}

// GET Handler - Admin dashboard query
export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const purpose = searchParams.get('purpose') || ''
    const status = searchParams.get('status') || ''
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')

    let inquiries = await getInquiries()

    // 1. Filter by search query (Name, Email, Phone, Message)
    if (search) {
      inquiries = inquiries.filter(i => 
        i.fullName.toLowerCase().includes(search) ||
        i.email.toLowerCase().includes(search) ||
        i.phone.includes(search) ||
        i.message.toLowerCase().includes(search)
      )
    }

    // 2. Filter by purpose
    if (purpose) {
      inquiries = inquiries.filter(i => i.purpose === purpose)
    }

    // 3. Filter by status
    if (status) {
      inquiries = inquiries.filter(i => i.status === status)
    }

    // Sort newest first
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 4. Pagination
    const total = inquiries.length
    const startIndex = (page - 1) * limit
    const paginatedInquiries = inquiries.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      inquiries: paginatedInquiries,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Failed to fetch inquiries API error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}


// POST Handler - Form submissions
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Verify email provider is configured (Resend)
    const resendKey = process.env.RESEND_API_KEY?.trim()
    const admin = process.env.ADMIN_EMAIL

    if (!resendKey || !admin) {
      const missing = []
      if (!resendKey) missing.push('RESEND_API_KEY')
      if (!admin) missing.push('ADMIN_EMAIL')
      return NextResponse.json({ 
        error: `Server Configuration Error: Missing required environment variables: ${missing.join(', ')}` 
      }, { status: 500 })
    }

    const body = await request.json()
    const { fullName, email, phone, purpose, message } = body

    // 1. Validation & Input Sanitization
    if (!fullName || !email || !phone || !purpose || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const sFullName = sanitize(fullName)
    const sEmail = sanitize(email)
    const sPhone = sanitize(phone)
    const sPurpose = sanitize(purpose)
    const sMessage = sanitize(message)

    if (!validateEmail(sEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (!validatePhone(sPhone)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
    }

    // 2. Spam protection / Rate Limiting (Check same email/IP in last 2s)
    const inquiries = await getInquiries()
    const now = new Date()
    const spamCheck = inquiries.find(i => 
      (i.email === sEmail || i.ipAddress === ip) && 
      (now.getTime() - new Date(i.createdAt).getTime()) < 2000
    )

    if (spamCheck) {
      return NextResponse.json({ error: 'You have submitted an inquiry recently. Please wait a moment before submitting again.' }, { status: 429 })
    }

    // 3. Save to database
    const id = `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const createdAt = now.toISOString()
    
    const newInquiry = {
      id,
      fullName: sFullName,
      email: sEmail,
      phone: sPhone,
      purpose: sPurpose,
      message: sMessage,
      createdAt,
      ipAddress: ip,
      status: 'New' as const
    }

    const saved = await addInquiry(newInquiry)
    if (!saved) {
      return NextResponse.json({ error: 'Server database failure. Please try again.' }, { status: 500 })
    }

    // 4. Create Admin Dashboard Notification
    const notificationId = `NT-${Date.now()}`
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    const newNotification = {
      id: notificationId,
      title: 'New Contact Inquiry Received',
      message: `A new inquiry has been submitted.\nName: ${sFullName}\nPurpose: ${sPurpose}\nPhone: ${sPhone}\nEmail: ${sEmail}\nTime: ${dateStr} ${timeStr}`,
      createdAt,
      isRead: false
    }
    await addNotification(newNotification)

    // 5. Send Emails via Nodemailer
    let emailSent = false
    let emailErrorMsg = ''
    
    const dateTimeStr = now.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    try {
      const adminHtml = getAdminNewContactInquiryEmail(sFullName, sEmail, sPhone, sPurpose, sMessage, dateTimeStr, ip)
      const userHtml = getContactFormConfirmationEmail(sFullName, sPurpose, sMessage, dateTimeStr)

      const sentAdmin = await sendSystemEmail(admin, '🔔 New Contact Inquiry Received', adminHtml)
      const sentUser = await sendSystemEmail(sEmail, 'Thank You for Contacting 2nd Inversion Musical School', userHtml)
      emailSent = sentAdmin && sentUser
    } catch (mailErr: any) {
      console.error('[Inquiries Route] Email notification failed:', mailErr)
      emailErrorMsg = mailErr.message || 'SMTP connection failed'
    }
    
    // Send WhatsApp messages asynchronously
    WhatsAppService.sendMessage('917768838832', `Hello Admin, a new contact form inquiry has been submitted:
Name: ${sFullName}
Phone: ${sPhone}
Email: ${sEmail}
Purpose: ${sPurpose}
Message: ${sMessage}`)
      .catch(err => console.error('[Inquiries Route] Failed to send admin WhatsApp inquiry notify:', err))

    WhatsAppService.sendMessage(sPhone, `Hello ${sFullName}, thank you for contacting 2ND INVERSION Music School! We have received your inquiry regarding "${sPurpose}". Our team will get back to you within 24 hours.`)
      .catch(err => console.error('[Inquiries Route] Failed to send student WhatsApp inquiry confirmation:', err))

    if (!emailSent) {
      return NextResponse.json({
        success: true,
        partialSuccess: true,
        inquiryId: id,
        message: 'Inquiry saved successfully, but email dispatch failed.',
        error: emailErrorMsg
      })
    }

    return NextResponse.json({
      success: true,
      inquiryId: id,
      emailSent: true,
      message: 'Inquiry submitted successfully.'
    })
  } catch (error) {
    console.error('Failed to create inquiry error:', error)
    return NextResponse.json({ error: 'Server error processing inquiry.' }, { status: 500 })
  }
}

// PUT Handler - Mark inquiries as Read
export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing inquiry ID or status' }, { status: 400 })
    }

    if (status !== 'New' && status !== 'Read') {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    const success = await updateInquiryStatus(id, status)
    if (success) {
      return NextResponse.json({ success: true, message: `Status updated to ${status}` })
    } else {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to update inquiry status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}

// DELETE Handler - Delete inquiry
export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 })
    }

    const success = await deleteInquiry(id)
    if (success) {
      return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to delete inquiry:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}
