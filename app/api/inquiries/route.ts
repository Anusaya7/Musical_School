import { NextResponse } from 'next/server'
import { getInquiries, addInquiry, updateInquiryStatus, deleteInquiry, addNotification } from '@/lib/db'
import nodemailer from 'nodemailer'

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

// Helper to configure SMTP transporter
function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // True for 465, false for other ports
    auth: {
      user,
      pass
    }
  })
}

// GET Handler - Admin dashboard query
export async function GET(request: Request) {
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

    // 2. Spam protection / Rate Limiting (Check same email/IP in last 60s)
    const inquiries = await getInquiries()
    const now = new Date()
    const spamCheck = inquiries.find(i => 
      (i.email === sEmail || i.ipAddress === ip) && 
      (now.getTime() - new Date(i.createdAt).getTime()) < 60000
    )

    if (spamCheck) {
      return NextResponse.json({ error: 'You have submitted an inquiry recently. Please wait 60 seconds before submitting again.' }, { status: 429 })
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
    const transporter = getTransporter()
    let emailSent = false
    let smtpMissing = false

    if (transporter) {
      try {
        const fromEmail = process.env.SMTP_FROM || '"2ND INVERSION" <noreply@2ndinversion.com>'
        
        // A. Email to Admin (aamrule90@gmail.com)
        await transporter.sendMail({
          from: fromEmail,
          to: 'aamrule90@gmail.com',
          subject: 'New Inquiry - 2ND INVERSION Music School',
          text: `New Inquiry Received:\n\nFull Name: ${sFullName}\nEmail: ${sEmail}\nPhone: ${sPhone}\nPurpose: ${sPurpose}\nMessage:\n${sMessage}\n\nSubmitted On: ${dateStr} ${timeStr}\nIP Address: ${ip}`
        })

        // B. Auto Reply to Student
        await transporter.sendMail({
          from: fromEmail,
          to: sEmail,
          subject: 'Thank you for contacting 2ND INVERSION Music School',
          text: `Hello ${sFullName},\n\nThank you for contacting 2ND INVERSION Music School.\nWe have successfully received your inquiry.\nOur team will contact you within 24 hours.\n\nIf your inquiry is urgent, please contact us directly.\n\nPhone:\n+91 77688 38832\n\nEmail:\naamrule90@gmail.com\n\nRegards,\n2ND INVERSION Music School`
        })

        emailSent = true
      } catch (err) {
        console.error('SMTP email transmission error:', err)
      }
    } else {
      smtpMissing = true
    }

    return NextResponse.json({
      success: true,
      inquiryId: id,
      emailSent,
      smtpMissing,
      message: 'Inquiry submitted successfully.'
    })
  } catch (error) {
    console.error('Failed to create inquiry error:', error)
    return NextResponse.json({ error: 'Server error processing inquiry.' }, { status: 500 })
  }
}

// PUT Handler - Mark inquiries as Read
export async function PUT(request: Request) {
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
