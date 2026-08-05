'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings-defaults'

export default function FAQSection() {
  const { theme } = useTheme()
  const { settings } = useSiteSettings()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = settings.faqs || DEFAULT_SITE_SETTINGS.faqs


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
