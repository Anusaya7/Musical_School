'use client'

import Header from '@/components/Header'
import FAQSection from '@/components/FAQSection'
import { useTheme } from '@/contexts/ThemeContext'
import { HelpCircle, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen relative font-sans ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-slate-800'}`}>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 bg-gradient-to-br from-purple-950 via-indigo-900 to-black text-white text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-purple-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Help Center
          </span>
          <h1 id="faq-title" className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Got questions? We have answers. Explore commonly asked questions about courses, schedules, and Trinity College certifications.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        <div className={`rounded-3xl p-8 md:p-12 border shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/80 border-gray-700/80' : 'bg-white border-[#E6EEFF]'
        }`}>
          
          <FAQSection />

          {/* Still Have Questions Box */}
          <div className={`mt-12 p-8 rounded-2xl border text-center space-y-6 ${
            theme === 'dark' ? 'bg-gray-800/40 border-gray-750' : 'bg-[#F2F7FF] border-[#D8E6FC]'
          }`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-500">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Still have questions?</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'}`}>
                If you cannot find the answer to your questions, please feel free to reach out to our administration team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
              <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-slate-200'
              }`}>
                <Mail className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold">Email Us</span>
                <Link href="mailto:aamrule90@gmail.com" className="text-xs text-purple-500 hover:underline">
                  aamrule90@gmail.com
                </Link>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-slate-200'
              }`}>
                <Phone className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold">Call Us</span>
                <Link href="tel:+919876543210" className="text-xs text-purple-500 hover:underline">
                  +91 98765 43210
                </Link>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-slate-200'
              }`}>
                <MapPin className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold">Visit Us</span>
                <span className="text-xs text-slate-400 font-medium text-center">
                  Pune, Maharashtra, India
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200/10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-500 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
