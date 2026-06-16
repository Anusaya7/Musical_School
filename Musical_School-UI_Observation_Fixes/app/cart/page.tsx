'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Header from '@/components/Header'

export default function CartPage() {
  const { items, total, itemCount, removeItem, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-16 sm:pt-16 lg:pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any courses to your cart yet. Start exploring our amazing courses!
              </p>
              
              <div className="flex justify-center">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="w-full sm:w-auto">
                    <button className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Browse Courses
                    </button>
                  </Link>

                  <Link href="/" className="w-full sm:w-auto">
                    <button className="w-full border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-16 sm:pt-16 lg:pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {itemCount} {itemCount === 1 ? 'course' : 'courses'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 w-full">
              {items.map((item) => (
              <div
                key={item.id}
                className="bg-white w-full rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Course Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    {/* Course Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-gray-600 mb-2">Instructor: {item.instructor}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          item.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          item.level === 'Advanced' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.level}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {item.duration}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
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

                <div className="flex flex-col gap-4">
                  <Link href="/checkout" classname="block mb-4">
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Proceed to Checkout
                    </button>
                  </Link>
                  
                  <Link href="/courses" classname="block">
                    <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-red-500 hover:text-red-700 py-2 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">Have a promo code?</p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <button className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[42px]">
                      Apply
                    </button>
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
