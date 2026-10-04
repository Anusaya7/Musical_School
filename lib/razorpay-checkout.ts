export interface RazorpayCheckoutResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface OpenCheckoutArgs {
  key: string
  amount: number
  currency?: string
  description: string
  orderId: string
  prefill?: { name?: string; email?: string; contact?: string }
  color?: string
  onSuccess: (response: RazorpayCheckoutResponse) => void
  onDismiss: () => void
  onFailed: (message: string) => void
}

/**
 * Opens Razorpay's official Checkout.
 * Card and UPI are requested explicitly. UPI QR / intent is shown by Checkout
 * when the Razorpay account has UPI enabled. This does not generate a QR image.
 */
export function openRazorpayCheckout(args: OpenCheckoutArgs) {
  const Razorpay = (window as Window & { Razorpay?: new (options: unknown) => { open: () => void; on: (event: string, cb: (payload: { error?: { description?: string } }) => void) => void } }).Razorpay
  if (!Razorpay) {
    throw new Error('Razorpay Checkout is still loading. Please try again.')
  }

  const checkout = new Razorpay({
    key: args.key,
    amount: args.amount,
    currency: args.currency || 'INR',
    name: '2nd Inversion Musical School',
    description: args.description,
    order_id: args.orderId,
    prefill: args.prefill,
    theme: { color: args.color || '#2563EB' },
    method: {
      card: true,
      upi: true,
      netbanking: false,
      wallet: false,
      emi: false,
      paylater: false
    },
    retry: { enabled: false },
    handler: args.onSuccess,
    modal: {
      ondismiss: args.onDismiss,
      confirm_close: true
    }
  })

  checkout.on('payment.failed', (payload) => {
    args.onFailed(payload?.error?.description || 'Payment failed')
  })
  checkout.open()
}

export async function verifyCheckoutPayment(response: RazorpayCheckoutResponse) {
  const res = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Payment verification failed')
  }
  return data
}

export async function reportCheckoutClosed(orderId: string, outcome: 'FAILED' | 'CANCELLED', reason?: string) {
  const path = outcome === 'FAILED' ? '/api/payment/failed' : '/api/payment/cancel'
  await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, reason: reason || undefined })
  }).catch(() => undefined)
}
