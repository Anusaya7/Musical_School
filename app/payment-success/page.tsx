'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Get the latest purchase from localStorage
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
    if (purchases.length > 0) {
      setPurchaseDetails(purchases[purchases.length - 1])
    }

    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/student')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-primary mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-lg text-green-600 font-semibold">Course Unlocked Successfully</p>
          </div>

          {/* Purchase Details */}
          {purchaseDetails && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchase Details</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{purchaseDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium">{purchaseDetails.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(purchaseDetails.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {purchaseDetails.customerInfo.firstName} {purchaseDetails.customerInfo.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{purchaseDetails.customerInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{purchaseDetails.customerInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Courses */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchased Courses</h3>
                <div className="space-y-3">
                  {purchaseDetails.courses.map((course: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{course.title}</p>
                          <p className="text-sm text-gray-600">{course.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{course.price}</p>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Unlocked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-800">Total Paid:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(purchaseDetails.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Next?</h2>
              <p className="text-gray-600 mb-8">
                Your courses are now available in your student dashboard. Start learning whenever you're ready!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/student')}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to My Courses
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>

              {/* Auto-redirect notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  You will be automatically redirected to your dashboard in {countdown} seconds...
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Information</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Access Duration</h4>
                  <p className="text-sm text-gray-600">
                    Lifetime access to all purchased courses. Learn at your own pace!
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Certificate</h4>
                  <p className="text-sm text-gray-600">
                    Receive a certificate upon successful completion of each course.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Support</h4>
                  <p className="text-sm text-gray-600">
                    Get help from our instructors and community throughout your learning journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
