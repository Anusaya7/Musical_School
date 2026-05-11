'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function FAQSection() {
  const { theme } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Can I upgrade from yearly to lifetime plan?',
      answer: 'Yes! You can upgrade anytime from your dashboard. We\'ll credit the amount you\'ve already paid towards the lifetime plan.'
    },
    {
      question: 'Are AI practice tools included in all plans?',
      answer: 'Absolutely! Both lifetime and yearly plans include full access to our AI-powered practice tools for piano, vocals, and music theory.'
    },
    {
      question: 'Do I get a certificate after completion?',
      answer: 'Yes! You\'ll receive an industry-recognized certificate for each course you complete. These can be added to your resume and LinkedIn profile.'
    },
    {
      question: 'Is this platform beginner-friendly?',
      answer: 'Definitely! Our courses are designed for all skill levels. We have dedicated beginner tracks with step-by-step guidance and AI assistance.'
    },
    {
      question: 'What if I\'m not satisfied with the course?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied, we\'ll refund your payment - no questions asked.'
    },
    {
      question: 'Can I access courses on mobile devices?',
      answer: 'Yes! Our platform is fully responsive. You can learn on your phone, tablet, or computer with seamless progress sync.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
      <h3 className={`text-2xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Frequently Asked Questions
      </h3>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-300 ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between"
            >
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className={`px-6 pb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
