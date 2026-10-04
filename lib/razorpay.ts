import crypto from 'crypto'
import Razorpay from 'razorpay'

const PLACEHOLDER_MARKERS = [
  'your_key',
  'your_razorpay',
  'your_razorpay_secret_key',
  'rzp_test_your_key_here',
  'abc123xyzSecretKeyHere',
  '1234567890'
]

function isPlaceholder(value: string) {
  const normalized = value.trim()
  return PLACEHOLDER_MARKERS.some(marker => normalized === marker || normalized.includes(marker))
}

export function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || ''
  if (!keyId || !keySecret || isPlaceholder(keyId) || isPlaceholder(keySecret)) {
    return null
  }
  return { keyId, keySecret }
}

export function getRazorpayClient() {
  const credentials = getRazorpayCredentials()
  if (!credentials) return null
  return new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret
  })
}

function timingSafeEqualHex(expected: string, received: string) {
  const expectedBuf = Buffer.from(expected, 'utf8')
  const receivedBuf = Buffer.from(received || '', 'utf8')
  if (expectedBuf.length !== receivedBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const credentials = getRazorpayCredentials()
  if (!credentials || !orderId || !paymentId || !signature) return false
  const expected = crypto
    .createHmac('sha256', credentials.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return timingSafeEqualHex(expected, signature)
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || ''
  if (!secret || isPlaceholder(secret)) {
    return { ok: false as const, reason: 'missing_secret' as const }
  }
  if (!signature) {
    return { ok: false as const, reason: 'missing_signature' as const }
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (!timingSafeEqualHex(expected, signature)) {
    return { ok: false as const, reason: 'mismatch' as const }
  }
  return { ok: true as const, reason: 'ok' as const }
}
