'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { openRazorpayCheckout, reportCheckoutClosed, verifyCheckoutPayment } from '@/lib/razorpay-checkout'

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user) return
    const [firstName, ...rest] = (session.user.name || '').split(' ')
    setFormData(prev => ({
      ...prev,
      firstName: prev.firstName || firstName || '',
      lastName: prev.lastName || rest.join(' '),
      email: session.user?.email || prev.email
    }))
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`)
      return
    }
    
    // Validate form
    if (!formData.firstName || !formData.firstName.trim() || !formData.lastName || !formData.lastName.trim()) {
      setErrorMessage('Please fill in your first and last name.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    const phoneClean = formData.phone.replace(/\D/g, '')
    if (!formData.phone || phoneClean.length < 10) {
      setErrorMessage('Please enter a valid phone number (at least 10 digits).')
      return
    }

    setIsProcessing(true)

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`
      const courseIds = items.map(item => item.id)

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: 'INR',
          purchaseType: 'course',
          courseIds,
          booking: { phone: formData.phone }
        })
      })

      const orderData = await orderRes.json()
      if (orderRes.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`)
        setIsProcessing(false)
        return
      }
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      if (Number(orderData.displayAmount) !== Math.round(total)) {
        setErrorMessage(`The payable amount is ${formatPrice(Number(orderData.displayAmount))} based on the current course price.`)
      }

      openRazorpayCheckout({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        description: `Course purchase: ${items.map(item => item.title).join(', ')}`,
        orderId: orderData.id,
        prefill: {
          name: customerName,
          email: session?.user?.email || formData.email,
          contact: formData.phone
        },
        color: '#2563EB',
        onSuccess: async (response) => {
          try {
            await verifyCheckoutPayment(response)
            clearCart()
            router.push(`/payment/success?orderId=${encodeURIComponent(response.razorpay_order_id)}`)
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || 'Payment verification failed. No course access was granted.')
            setIsProcessing(false)
            router.push('/payment/failed?reason=failed')
          }
        },
        onDismiss: () => {
          reportCheckoutClosed(orderData.id, 'CANCELLED')
          setIsProcessing(false)
          router.push('/payment/failed?reason=cancelled')
        },
        onFailed: (message) => {
          reportCheckoutClosed(orderData.id, 'FAILED', message)
          setErrorMessage('Your payment could not be completed. No course access was granted.')
          setIsProcessing(false)
          router.push('/payment/failed?reason=failed')
        }
      })

    } catch (error: any) {
      console.error('Checkout error:', error)
      setErrorMessage(error.message || 'Checkout failed. Please try again.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">No Courses in Cart</h1>
            <p className="text-gray-600 mb-8">Please add courses to your cart before proceeding to checkout.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Billing Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="First Name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={!!session?.user?.email}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Kawade Nagar"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Pune"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="CA"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : status === 'authenticated' ? `Pay ${formatPrice(total)} Securely` : 'Log in to Pay'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Course List */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.instructor}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'course' : 'courses'})</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Payment with Razorpay</span>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    <img src="/api/placeholder/40/20" alt="Visa" className="h-8" />
                    <img src="/api/placeholder/40/20" alt="Mastercard" className="h-8" />
                    <img src="/api/placeholder/40/20" alt="Razorpay" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
