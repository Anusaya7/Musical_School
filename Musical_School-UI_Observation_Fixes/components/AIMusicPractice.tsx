'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import PlanModal from './PlanModal'
import SuccessPage from './SuccessPage'
import FAQSection from './FAQSection'

export default function AIMusicPractice() {
  const { theme } = useTheme()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('lifetime')
  const [showModal, setShowModal] = useState(false)
  const [modalPlan, setModalPlan] = useState<'lifetime' | 'yearly'>('lifetime')
  const [showSuccess, setShowSuccess] = useState(false)
  const [purchasedPlan, setPurchasedPlan] = useState('')
  const [userPurchased, setUserPurchased] = useState(false) // Simulate user state

  const aiFeatures = [
    {
      title: 'AI Piano Practice',
      description: 'Play your piano and get instant feedback on notes, timing, and accuracy.',
      subtext: 'Detect mistakes and improve faster',
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
      color: 'blue'
    },
    {
      title: 'AI Vocal Trainer',
      description: 'Improve pitch, tone, and vocal control with real-time AI analysis.',
      subtext: 'Perfect your singing with intelligent feedback',
      icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
      color: 'purple'
    },
    {
      title: 'AI Music Assistant',
      description: 'Generate melodies, practice exercises, and personalized learning suggestions.',
      subtext: 'Your personal AI music companion',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'green'
    }
  ]

  const plans = [
    {
      id: 'lifetime',
      name: 'Lifetime Access Plan',
      badge: 'Best Value',
      price: 'One-time payment',
      features: [
        'Unlimited access to all courses',
        'AI practice tools included',
        'Future updates included',
        'Certificate of completion',
        'Priority support'
      ],
      buttonText: 'Get Lifetime Access',
      highlighted: true,
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    },
    {
      id: 'yearly',
      name: '1-Year Pro Plan',
      badge: null,
      price: '12 months access',
      features: [
        'Access for 12 months',
        'All courses + AI features',
        'Certificate included',
        'Regular support',
        'Progress tracking'
      ],
      buttonText: 'Start 1-Year Plan',
      highlighted: false,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    }
  ]

  const sellingPoints = [
    'AI-Powered Learning Experience',
    'Flexible Learning Plans',
    'Practice Anytime, Anywhere',
    'Real Progress Tracking'
  ]

  const getIconColor = (color: string) => {
    switch(color) {
      case 'blue': return 'text-blue-600'
      case 'purple': return 'text-purple-600'
      case 'green': return 'text-green-600'
      default: return 'text-blue-600'
    }
  }

  const getBgGradient = (color: string) => {
    switch(color) {
      case 'blue': return 'from-blue-500 to-cyan-500'
      case 'purple': return 'from-purple-500 to-pink-500'
      case 'green': return 'from-green-500 to-emerald-500'
      default: return 'from-blue-500 to-cyan-500'
    }
  }

  const handlePlanSelect = (planId: 'lifetime' | 'yearly') => {
    if (userPurchased) {
      router.push('/student')
      return
    }
    setModalPlan(planId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handlePlanPurchase = (plan: 'lifetime' | 'yearly') => {
    setShowModal(false)
    setPurchasedPlan(plan === 'lifetime' ? 'Lifetime Access Plan' : '1-Year Pro Plan')
    setUserPurchased(true)
    setShowSuccess(true)
  }

  const handleStartLearning = () => {
    setShowSuccess(false)
    router.push('/student')
  }

  return (
    <section className={`py-20 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(99, 102, 241, 0.1) 35px, rgba(99, 102, 241, 0.1) 70px)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Practice Smarter with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span> Music Learning
          </h2>
          <p className={`text-xl max-w-4xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            Enhance your skills with intelligent practice tools that listen, analyze, and guide you in real-time. Choose flexible plans that suit your learning journey.
          </p>
        </div>

        {/* AI Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className={`relative group p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getBgGradient(feature.color)} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`relative w-20 h-20 bg-gradient-to-br ${getBgGradient(feature.color)} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <svg className={`w-10 h-10 text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3 leading-relaxed`}>
                  {feature.description}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                  {feature.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl transition-all duration-500 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white scale-105 shadow-2xl border-2 border-purple-400'
                    : theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-16 h-16 ${
                  plan.highlighted 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <svg className={`w-8 h-8 ${
                    plan.highlighted ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={plan.icon} />
                  </svg>
                </div>

                {/* Plan Content */}
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-lg mb-6 ${
                    plan.highlighted ? 'text-white/90' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {plan.price}
                  </p>

                  {/* Features */}
                  <ul className={`space-y-3 mb-8 text-left ${
                    plan.highlighted ? 'text-white/90' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.highlighted ? 'bg-white/20' : 'bg-green-100'
                        }`}>
                          <svg className={`w-3 h-3 ${
                            plan.highlighted ? 'text-white' : 'text-green-600'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.id as 'lifetime' | 'yearly')}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                      plan.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-gray-100'
                        : theme === 'dark'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {userPurchased ? 'Already Enrolled' : plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className={`text-2xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Plan Comparison
          </h3>
          <div className={`overflow-hidden rounded-2xl border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Feature
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Lifetime
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    1-Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'All Courses', lifetime: true, yearly: true },
                  { feature: 'AI Features', lifetime: true, yearly: true },
                  { feature: 'Duration', lifetime: 'Lifetime', yearly: '12 mo' },
                  { feature: 'Certificate', lifetime: true, yearly: true },
                  { feature: 'Priority Support', lifetime: true, yearly: false }
                ].map((row, index) => (
                  <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {row.feature}
                    </td>
                    <td className={`px-6 py-4 text-center`}>
                      {typeof row.lifetime === 'boolean' ? (
                        <div className={`w-6 h-6 rounded-full mx-auto ${
                          row.lifetime ? 'bg-green-500' : 'bg-gray-300'
                        } flex items-center justify-center`}>
                          {row.lifetime && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row.lifetime}
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-center`}>
                      {typeof row.yearly === 'boolean' ? (
                        <div className={`w-6 h-6 rounded-full mx-auto ${
                          row.yearly ? 'bg-green-500' : 'bg-gray-300'
                        } flex items-center justify-center`}>
                          {row.yearly && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row.yearly}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Selling Points */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-wrap justify-center gap-4">
            {sellingPoints.map((point, index) => (
              <div
                key={index}
                className={`px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border border-gray-700 text-gray-300'
                    : 'bg-white/50 border border-gray-200 text-gray-700'
                }`}
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PlanModal
        isOpen={showModal}
        onClose={handleModalClose}
        plan={modalPlan}
        onProceed={handlePlanPurchase}
      />
      
      <SuccessPage
        isOpen={showSuccess}
        planName={purchasedPlan}
        onStartLearning={handleStartLearning}
      />
    </section>
  )
}
