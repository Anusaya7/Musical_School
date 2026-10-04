import { randomUUID } from 'crypto'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getRazorpayClient, getRazorpayCredentials, verifyCheckoutSignature, verifyWebhookSignature } from '@/lib/razorpay'
import { sendSystemEmail } from '@/lib/email'
import type { Prisma } from '@/lib/generated/prisma'

const PAID_STATUSES = new Set(['PAID', 'Success', 'SUCCESS', 'Paid', 'CAPTURED', 'Completed', 'COMPLETED'])
const PLAN_PRICES_INR: Record<string, { name: string; amount: number }> = {
  lifetime: { name: 'Lifetime Access Plan', amount: 9999 },
  yearly: { name: '1-Year Pro Plan', amount: 2999 }
}

export class PaymentError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function rupeesToPaise(amount: number) {
  return Math.round(Number(amount) * 100)
}

function clampText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function resolvePlan(plan: unknown) {
  const value = String(plan || '').toLowerCase()
  if (value.includes('lifetime')) return { id: 'lifetime', ...PLAN_PRICES_INR.lifetime }
  if (value.includes('yearly') || value.includes('1-year') || value.includes('pro')) {
    return { id: 'yearly', ...PLAN_PRICES_INR.yearly }
  }
  return null
}

export async function requirePayer() {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase().trim()
  if (!email) {
    throw new PaymentError('Please log in before making a payment.', 401)
  }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.status === 'Suspended') {
    throw new PaymentError('Your account cannot make a payment.', 403)
  }
  return user
}

function isPaid(status: string) {
  return PAID_STATUSES.has(status)
}

async function coursesAlreadyOwned(email: string, enrolledCourses: string[], courseIds: string[]) {
  const owned = new Set(enrolledCourses || [])
  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: { in: courseIds },
      status: 'Active',
      student: { email }
    },
    select: { courseId: true }
  })
  for (const enrollment of enrollments) owned.add(enrollment.courseId)
  return courseIds.filter(id => owned.has(id))
}

export async function createPaymentOrder(body: {
  purchaseType?: string
  courseIds?: unknown
  courseId?: unknown
  plan?: unknown
  booking?: {
    date?: unknown
    timeSlot?: unknown
    batchTiming?: unknown
    instructor?: unknown
    phone?: unknown
  }
}) {
  const user = await requirePayer()
  const credentials = getRazorpayCredentials()
  const razorpay = getRazorpayClient()
  if (!credentials || !razorpay) {
    throw new PaymentError('Razorpay Test Mode is not configured on the server.', 500)
  }

  const purchaseType = body.purchaseType === 'booking' || body.purchaseType === 'plan' ? body.purchaseType : 'course'
  const requestedIds = Array.isArray(body.courseIds)
    ? body.courseIds
    : typeof body.courseIds === 'string'
      ? body.courseIds.split(',')
      : body.courseId
        ? [body.courseId]
        : []
  const courseIds = Array.from(new Set(requestedIds.map(id => String(id || '').trim()).filter(Boolean)))

  let lineItems: { courseId: string; courseName: string; amount: number }[] = []
  let metadata: Record<string, string> | null = null

  if (purchaseType === 'plan') {
    const plan = resolvePlan(body.plan)
    if (!plan) throw new PaymentError('Unknown plan.')
    lineItems = [{ courseId: `plan-${plan.id}`, courseName: plan.name, amount: plan.amount }]
    metadata = { plan: plan.id }
  } else {
    if (courseIds.length === 0 || courseIds.length > 10) {
      throw new PaymentError('Select between 1 and 10 courses.')
    }
    if (courseIds.some(id => !/^[a-zA-Z0-9_-]{1,80}$/.test(id))) {
      throw new PaymentError('Invalid course selection.')
    }
    if (purchaseType === 'booking' && courseIds.length !== 1) {
      throw new PaymentError('A class booking can include one course.')
    }

    const courses = await prisma.course.findMany({ where: { id: { in: courseIds } } })
    if (courses.length !== courseIds.length) {
      throw new PaymentError('One or more courses could not be found.', 404)
    }

    const unavailable = courses.filter(course => course.isDisabled || course.status === 'ARCHIVED')
    if (unavailable.length > 0) {
      throw new PaymentError('One or more courses are not available for purchase.')
    }

    const owned = await coursesAlreadyOwned(user.email.toLowerCase(), user.enrolledCourses || [], courseIds)
    if (owned.length > 0) {
      const names = courses.filter(course => owned.includes(course.id)).map(course => course.title)
      throw new PaymentError(`You already have access to ${names.join(', ')}.`, 409)
    }

    lineItems = courses.map(course => ({
      courseId: course.id,
      courseName: course.title,
      amount: Number(course.price)
    }))

    if (purchaseType === 'booking') {
      const date = clampText(body.booking?.date, 20)
      const timeSlot = clampText(body.booking?.timeSlot, 40)
      const batchTiming = clampText(body.booking?.batchTiming, 40)
      const instructor = clampText(body.booking?.instructor, 120)
      const phone = clampText(body.booking?.phone, 20)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !timeSlot || !batchTiming) {
        throw new PaymentError('Choose a class date, batch, and time slot before paying.')
      }
      metadata = { date, timeSlot, batchTiming, instructor, phone }
    }
  }

  if (lineItems.some(item => !Number.isFinite(item.amount) || item.amount <= 0)) {
    throw new PaymentError('This course does not have a valid price.')
  }

  const amountPaise = lineItems.reduce((sum, item) => sum + rupeesToPaise(item.amount), 0)
  if (!Number.isInteger(amountPaise) || amountPaise < 100) {
    throw new PaymentError('Amount must be at least 100 paise.', 400)
  }

  const receipt = `rcpt_${Date.now()}`.slice(0, 40)
  let order: { id: string; amount: number | string; currency: string }
  try {
    order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      payment_capture: true,
      notes: {
        userId: user.id.slice(0, 40),
        purchaseType,
        courseIds: lineItems.map(item => item.courseId).join(',').slice(0, 250)
      }
    })
  } catch (error) {
    console.error('[PAYMENT] Razorpay order creation failed', {
      userId: user.id,
      purchaseType,
      message: error instanceof Error ? error.message : 'unknown'
    })
    throw new PaymentError('Razorpay could not create the payment order. Please try again.', 500)
  }

  const metadataJson = metadata ? JSON.stringify(metadata) : null
  await prisma.payment.createMany({
    data: lineItems.map(item => ({
      id: `PAY-${randomUUID()}`,
      userId: user.id,
      studentEmail: user.email.toLowerCase(),
      studentName: user.name,
      courseId: item.courseId,
      courseName: item.courseName,
      amount: item.amount,
      currency: 'INR',
      paymentId: `pending_${order.id}_${item.courseId}`.slice(0, 120),
      orderId: order.id,
      razorpayOrderId: order.id,
      status: 'PENDING',
      purchaseType,
      metadata: metadataJson
    }))
  })

  return {
    success: true,
    key: credentials.keyId,
    id: order.id,
    order_id: order.id,
    amount: Number(order.amount),
    currency: 'INR',
    displayAmount: amountPaise / 100
  }
}

async function ensureCourseAccess(tx: Prisma.TransactionClient, args: {
  userId: string
  email: string
  studentName: string
  courseId: string
  courseName: string
  amount: number
}) {
  if (args.courseId.startsWith('plan-')) return

  const user = await tx.user.findUnique({ where: { id: args.userId } })
  if (user && !user.enrolledCourses.includes(args.courseId)) {
    await tx.user.update({
      where: { id: args.userId },
      data: { enrolledCourses: [...user.enrolledCourses, args.courseId] }
    })
  }

  const student = await tx.student.upsert({
    where: { email: args.email },
    update: { name: args.studentName, status: 'Active' },
    create: { name: args.studentName, email: args.email, status: 'Active' }
  })

  const existing = await tx.enrollment.findFirst({
    where: { studentId: student.id, courseId: args.courseId, status: 'Active' }
  })
  if (!existing) {
    await tx.enrollment.create({
      data: {
        studentId: student.id,
        courseId: args.courseId,
        courseName: args.courseName,
        amount: args.amount,
        status: 'Active'
      }
    })
  }
}

async function loadCapturedPayment(orderId: string, paymentId: string, expectedPaise: number) {
  const razorpay = getRazorpayClient()
  if (!razorpay) throw new PaymentError('Payment gateway configuration missing', 500)

  let payment: { id?: string; order_id?: string; amount?: number | string; currency?: string; status?: string; method?: string }
  try {
    payment = await razorpay.payments.fetch(paymentId)
  } catch (error) {
    console.error('[PAYMENT] Unable to fetch Razorpay payment', {
      orderId,
      paymentId,
      message: error instanceof Error ? error.message : 'unknown'
    })
    throw new PaymentError('Payment could not be confirmed with Razorpay.', 502)
  }

  if (payment.order_id !== orderId) {
    throw new PaymentError('Payment does not match this order.', 400)
  }
  if (String(payment.currency || 'INR').toUpperCase() !== 'INR') {
    throw new PaymentError('Payment currency is not INR.', 400)
  }
  if (Number(payment.amount) !== expectedPaise) {
    console.error('[PAYMENT] Amount mismatch', { orderId, paymentId, expectedPaise, received: payment.amount })
    throw new PaymentError('Payment amount does not match the course price.', 400)
  }

  if (payment.status === 'authorized') {
    try {
      payment = await razorpay.payments.capture(paymentId, expectedPaise, 'INR')
    } catch (error) {
      console.error('[PAYMENT] Capture failed', {
        orderId,
        paymentId,
        message: error instanceof Error ? error.message : 'unknown'
      })
      throw new PaymentError('Payment was not captured.', 402)
    }
  }

  if (payment.status !== 'captured') {
    throw new PaymentError('Payment is not completed.', 402)
  }

  return {
    method: clampText(payment.method, 40) || null
  }
}

export async function fulfillCapturedPayment(orderId: string, paymentId: string) {
  const existing = await prisma.payment.findMany({ where: { orderId } })
  if (existing.length === 0) {
    console.error('[PAYMENT] Captured payment has no internal order', { orderId, paymentId })
    throw new PaymentError('Payment order was not found.', 404)
  }

  const expectedPaise = existing.reduce((sum, row) => sum + rupeesToPaise(Number(row.amount)), 0)
  const captured = await loadCapturedPayment(orderId, paymentId, expectedPaise)
  const owner = existing[0]

  const result = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${orderId}))`
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${owner.studentEmail}))`
    const rows = await tx.payment.findMany({ where: { orderId } })
    if (rows.length === 0) throw new PaymentError('Payment order was not found.', 404)

    const alreadyPaid = rows.every(row => isPaid(row.status) && row.razorpayPaymentId === paymentId)
    const user = owner.userId
      ? await tx.user.findUnique({ where: { id: owner.userId } })
      : await tx.user.findUnique({ where: { email: owner.studentEmail } })

    if (!user) throw new PaymentError('Student account was not found.', 404)

    for (const row of rows) {
      if (row.purchaseType === 'plan' || row.courseId.startsWith('plan-')) continue
      await ensureCourseAccess(tx, {
        userId: user.id,
        email: user.email.toLowerCase(),
        studentName: user.name,
        courseId: row.courseId,
        courseName: row.courseName,
        amount: row.amount
      })
    }

    const bookingMeta = safeMetadata(rows[0]?.metadata)
    let bookingId: string | null = null
    if (rows[0]?.purchaseType === 'booking' && bookingMeta?.date && bookingMeta.timeSlot) {
      const existingBooking = await tx.booking.findFirst({ where: { orderId } })
      if (existingBooking) {
        bookingId = existingBooking.id
      } else {
        bookingId = `BK-${Date.now()}`
        await tx.booking.create({
          data: {
            id: bookingId,
            courseId: rows[0].courseId,
            courseName: rows[0].courseName,
            instructor: bookingMeta.instructor || '2nd Inversion',
            date: bookingMeta.date,
            timeSlot: bookingMeta.timeSlot,
            batchTiming: bookingMeta.batchTiming || 'Batch',
            studentName: user.name,
            studentEmail: user.email.toLowerCase(),
            status: 'Confirmed',
            amount: rows.reduce((sum, row) => sum + Number(row.amount), 0),
            paymentMethod: captured.method || 'Razorpay',
            studentId: user.id,
            paymentId,
            orderId,
            paymentStatus: 'PAID',
            receiptNumber: rows[0].invoiceNumber,
            emailStatus: 'Pending',
            notificationStatus: 'Created'
          }
        })
      }
    }

    if (!alreadyPaid) {
      const invoiceNumber = rows[0].invoiceNumber || `INV-${Date.now().toString().slice(-8)}`
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          status: 'PAID',
          paymentId,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          paymentMethod: captured.method,
          failureReason: null,
          invoiceNumber,
          userId: user.id,
          studentEmail: user.email.toLowerCase(),
          studentName: user.name
        }
      })

      await tx.notification.create({
        data: {
          title: 'Course payment received',
          message: `${user.name} paid ₹${(expectedPaise / 100).toLocaleString('en-IN')} for ${rows.map(row => row.courseName).join(', ')}`
        }
      })
      await tx.auditLog.create({
        data: {
          userEmail: user.email.toLowerCase(),
          action: 'PAYMENT_CAPTURED',
          details: `Order ${orderId} payment ${paymentId} captured`
        }
      })
    }

    return {
      alreadyPaid,
      bookingId,
      email: user.email.toLowerCase(),
      name: user.name,
      courses: rows.map(row => ({ name: row.courseName, amount: row.amount, courseId: row.courseId })),
      amount: expectedPaise / 100
    }
  }, { maxWait: 8000, timeout: 20000 })

  await sendPaymentEmailsOnce(orderId, result)

  return {
    success: true,
    alreadyProcessed: result.alreadyPaid,
    orderId,
    paymentId,
    amount: result.amount,
    bookingId: result.bookingId,
    courseName: result.courses.map(course => course.name).join(', '),
    studentEmail: result.email
  }
}

function safeMetadata(raw: string | null | undefined) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, string>
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

async function sendPaymentEmailsOnce(orderId: string, result: {
  email: string
  name: string
  courses: { name: string; amount: number }[]
  amount: number
  bookingId: string | null
}) {
  const claim = await prisma.payment.updateMany({
    where: { orderId, emailSentAt: null, status: 'PAID' },
    data: { emailSentAt: new Date() }
  })
  if (claim.count === 0) return

  const payment = await prisma.payment.findFirst({ where: { orderId } })
  const courseList = result.courses
    .map(course => `<li><strong>${escapeHtml(course.name)}</strong> — ₹${course.amount.toLocaleString('en-IN')}</li>`)
    .join('')
  const studentHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #6d28d9;">Payment confirmation</h2>
      <p>Hello <strong>${escapeHtml(result.name)}</strong>,</p>
      <p>Your payment was verified and your course access is active.</p>
      <ul>${courseList}</ul>
      <p><strong>Amount:</strong> ₹${result.amount.toLocaleString('en-IN')}</p>
      <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
      <p><strong>Payment ID:</strong> ${escapeHtml(payment?.razorpayPaymentId || payment?.paymentId || '')}</p>
      <p>You can open My Courses from your student dashboard.</p>
    </div>
  `
  const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #6d28d9;">New verified payment</h2>
      <p><strong>Student:</strong> ${escapeHtml(result.name)} (${escapeHtml(result.email)})</p>
      <p><strong>Courses:</strong> ${escapeHtml(result.courses.map(course => course.name).join(', '))}</p>
      <p><strong>Amount:</strong> ₹${result.amount.toLocaleString('en-IN')}</p>
      <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
    </div>
  `

  try {
    const sends = [sendSystemEmail(result.email, 'Payment confirmed — 2nd Inversion', studentHtml)]
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      sends.push(sendSystemEmail(adminEmail, 'New course payment', adminHtml))
    }
    await Promise.all(sends)
  } catch (error) {
    console.error('[PAYMENT] Confirmation email failed', {
      orderId,
      message: error instanceof Error ? error.message : 'unknown'
    })
  }
}

export async function verifyAndFulfill(args: {
  razorpay_order_id?: unknown
  razorpay_payment_id?: unknown
  razorpay_signature?: unknown
}) {
  const user = await requirePayer()
  const orderId = clampText(args.razorpay_order_id, 80)
  const paymentId = clampText(args.razorpay_payment_id, 80)
  const signature = clampText(args.razorpay_signature, 128)
  if (!orderId.startsWith('order_') || !paymentId.startsWith('pay_') || !signature) {
    throw new PaymentError('Payment confirmation is incomplete.')
  }

  const rows = await prisma.payment.findMany({ where: { orderId } })
  if (rows.length === 0) throw new PaymentError('Payment order was not found.', 404)
  const ownerEmail = rows[0].studentEmail.toLowerCase()
  if (ownerEmail !== user.email.toLowerCase()) {
    throw new PaymentError('You cannot verify this payment.', 403)
  }

  if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
    console.warn('[PAYMENT] Checkout signature rejected', { orderId, paymentId, userId: user.id })
    await markOrderOutcome({
      orderId,
      userEmail: user.email,
      status: 'FAILED',
      reason: 'Signature verification failed'
    })
    throw new PaymentError('Payment verification failed. No course access was granted.', 400)
  }

  return fulfillCapturedPayment(orderId, paymentId)
}

export async function markOrderOutcome(args: {
  orderId: string
  userEmail: string
  status: 'FAILED' | 'CANCELLED'
  reason?: string
}) {
  const reason = clampText(args.reason, 300) || null
  const updated = await prisma.payment.updateMany({
    where: {
      orderId: args.orderId,
      studentEmail: args.userEmail.toLowerCase(),
      status: 'PENDING'
    },
    data: {
      status: args.status,
      failureReason: reason
    }
  })
  if (updated.count > 0) {
    await prisma.auditLog.create({
      data: {
        userEmail: args.userEmail.toLowerCase(),
        action: args.status === 'CANCELLED' ? 'PAYMENT_CANCELLED' : 'PAYMENT_FAILED',
        details: `Order ${args.orderId}${reason ? `: ${reason}` : ''}`
      }
    })
  }
  return updated.count
}

export async function getOwnedPaymentStatus(orderId: string) {
  const user = await requirePayer()
  const role = String(user.role || '').toUpperCase()
  const rows = await prisma.payment.findMany({
    where: { orderId },
    orderBy: { createdAt: 'asc' }
  })
  if (rows.length === 0) throw new PaymentError('Payment order was not found.', 404)
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
  if (!isAdmin && rows[0].studentEmail.toLowerCase() !== user.email.toLowerCase()) {
    throw new PaymentError('You cannot view this payment.', 403)
  }

  const booking = await prisma.booking.findFirst({ where: { orderId } })
  const status = rows.some(row => isPaid(row.status))
    ? 'PAID'
    : rows.some(row => row.status === 'FAILED')
      ? 'FAILED'
      : rows.some(row => row.status === 'CANCELLED')
        ? 'CANCELLED'
        : 'PENDING'

  return {
    success: true,
    status,
    orderId,
    paymentId: rows.find(row => row.razorpayPaymentId)?.razorpayPaymentId || null,
    amount: rows.reduce((sum, row) => sum + Number(row.amount), 0),
    currency: 'INR',
    paymentMethod: rows.find(row => row.paymentMethod)?.paymentMethod || null,
    failureReason: rows.find(row => row.failureReason)?.failureReason || null,
    courses: rows.map(row => ({
      id: row.courseId,
      name: row.courseName,
      amount: row.amount
    })),
    bookingId: booking?.id || null,
    createdAt: rows[0].createdAt.toISOString()
  }
}

export async function handleRazorpayWebhook(rawBody: string, signature: string | null) {
  const verification = verifyWebhookSignature(rawBody, signature)
  if (!verification.ok) {
    console.warn('[WEBHOOK] Rejected Razorpay webhook', { reason: verification.reason })
    throw new PaymentError(
      verification.reason === 'missing_secret' ? 'Webhook secret is not configured' : 'Invalid webhook signature',
      verification.reason === 'missing_secret' ? 500 : 400
    )
  }

  let payload: {
    event?: string
    payload?: {
      payment?: { entity?: Record<string, unknown> }
      order?: { entity?: Record<string, unknown> }
    }
  }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    throw new PaymentError('Invalid webhook payload', 400)
  }

  const event = payload.event || ''
  const paymentEntity = payload.payload?.payment?.entity
  const orderEntity = payload.payload?.order?.entity
  const orderId = String(paymentEntity?.order_id || orderEntity?.id || '')
  const paymentId = String(paymentEntity?.id || '')

  if (event === 'payment.captured' || event === 'order.paid') {
    if (!orderId || !paymentId.startsWith('pay_')) {
      console.error('[WEBHOOK] Captured event missing ids', { event, orderId })
      return { received: true, ignored: true }
    }
    await fulfillCapturedPayment(orderId, paymentId)
    return { received: true, processed: event }
  }

  if (event === 'payment.failed' && orderId) {
    const reason = clampText(paymentEntity?.error_description || paymentEntity?.error_reason, 300) || 'Payment failed'
    const updated = await prisma.payment.updateMany({
      where: { orderId, status: 'PENDING' },
        data: { status: 'FAILED', failureReason: reason, paymentMethod: clampText(paymentEntity?.method, 40) || null }
    })
    if (updated.count > 0) {
      await prisma.auditLog.create({
        data: {
          userEmail: 'system@razorpay',
          action: 'WEBHOOK_PAYMENT_FAILED',
          details: `Order ${orderId} failed`
        }
      })
    }
    return { received: true, processed: event }
  }

  return { received: true, ignored: true }
}
