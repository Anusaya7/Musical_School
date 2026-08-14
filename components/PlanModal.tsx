'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: 'lifetime' | 'yearly'
  onProceed: (plan: 'lifetime' | 'yearly') => void
}

export default function PlanModal({ isOpen, onClose, plan, onProceed }: PlanModalProps) {
  const { theme } = useTheme()
  const [showPayment, setShowPayment] = useState(false)

  const lifetimePlan = {
    name: 'Lifetime Access Plan',
    price: '9,999',
    currency: 'INR',
    duration: 'Lifetime',
    features: [
      'Unlimited course access',
      'AI practice tools included',
      'Lifetime updates',
      'Certificate of completion',
      'Priority support',
      'All future courses'
    ],
    badge: 'Best Value',
    savings: 'Save 70% compared to yearly plans'
  }

  const yearlyPlan = {
    name: '1-Year Pro Plan',
    price: '2,999',
    currency: 'INR',
    duration: '12 months',
    features: [
      'Access for 12 months',
      'All courses + AI features',
      'Certificate included',
      'Regular support',
      'Progress tracking',
      'Monthly new content'
    ],
    badge: null,
    savings: null
  }

  const currentPlan = plan === 'lifetime' ? lifetimePlan : yearlyPlan
  const otherPlan = plan === 'lifetime' ? yearlyPlan : lifetimePlan

  const handleProceed = () => {
    setShowPayment(true)
  }

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the ${currentPlan.name}. Can you provide more details?`
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleUpgrade = () => {
    onProceed('lifetime')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!showPayment ? (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentPlan.name}
              </h2>
              {currentPlan.badge && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  {currentPlan.badge}
                </div>
              )}
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {currentPlan.currency === 'INR' ? 'Rs.' : '$'}{currentPlan.price}
              </div>
              {currentPlan.savings && (
                <p className="text-green-600 font-semibold">{currentPlan.savings}</p>
              )}
            </div>

            {/* Plan Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Current Plan */}
              <div className={`p-6 rounded-2xl border-2 ${
                plan === 'lifetime' 
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50' 
                  : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentPlan.name}
                </h3>
                <ul className="space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison */}
              <div className={`p-6 rounded-2xl border ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Compare with {otherPlan.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {currentPlan.duration} vs {otherPlan.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Priority Support</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {plan === 'lifetime' ? 'Included' : 'Not included'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Cost</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {currentPlan.currency === 'INR' ? 'Rs.' : '$'}{currentPlan.price} vs {otherPlan.currency === 'INR' ? 'Rs.' : '$'}{otherPlan.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Elements */}
            <div className={`p-4 rounded-xl mb-8 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    30-Day Money Back Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Secure Payments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Trusted by 10,000+ students
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleProceed}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                {plan === 'lifetime' ? 'Proceed to Payment' : 'Start Subscription'}
              </button>
              <button
                onClick={handleWhatsApp}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Talk to Advisor (WhatsApp)
              </button>
              {plan === 'yearly' && (
                <button
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  Upgrade to Lifetime
                </button>
              )}
            </div>
          </div>
        ) : (
          <PaymentForm 
            plan={currentPlan} 
            onBack={() => setShowPayment(false)}
            onSuccess={() => onProceed(plan)}
          />
        )}
      </div>
    </div>
  )
}

function PaymentForm({ plan, onBack, onSuccess }: { plan: any; onBack: () => void; onSuccess: () => void }) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'upi'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsProcessing(true)

    try {
      const numericPrice = Number(String(plan.price).replace(/,/g, ''))
      const amountPaise = Math.round(numericPrice * 100)

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_plan_${Date.now()}`,
          notes: {
            purchaseType: 'plan',
            plan: plan.name,
            studentName: formData.name,
            studentEmail: formData.email,
            studentPhone: formData.phone
          }
        })
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Razorpay Test Mode is not configured. Order creation failed.')
      }

      const Razorpay = (window as any).Razorpay
      if (!Razorpay) {
        throw new Error('Razorpay Checkout SDK is loading. Please try again.')
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: '2nd Inversion Musical School',
        description: `Subscription Plan: ${plan.name}`,
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#4F46E5' },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  amount: numericPrice,
                  notes: {
                    purchaseType: 'plan',
                    plan: plan.name,
                    studentName: formData.name,
                    studentEmail: formData.email,
                    studentPhone: formData.phone
                  }
                }
              })
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.')
            }
            onSuccess()
          } catch (vErr: any) {
            console.error('Plan payment verification error:', vErr)
            setErrorMsg(vErr.message || 'Payment verification failed.')
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          }
        }
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (err: any) {
      console.error('Plan payment error:', err)
      setErrorMsg(err.message || 'Could not process plan payment request.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        disabled={isProcessing}
        className={`mb-6 flex items-center gap-2 ${
          theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to plan details
      </button>

      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Complete Your Purchase
        </h2>
        <div className={`inline-block p-4 rounded-xl ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{plan.name}</p>
          <p className="text-2xl font-bold text-indigo-600">
            {plan.currency === 'INR' ? 'Rs.' : '$'}{plan.price}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              required
              disabled={isProcessing}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isProcessing}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            required
            disabled={isProcessing}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isProcessing ? 'Processing...' : `Proceed to Payment - ${plan.currency === 'INR' ? 'Rs.' : '$'}${plan.price}`}
        </button>
      </form>
    </div>
  )
}
