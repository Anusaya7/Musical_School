'use client'

import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { Shield, Eye, Lock, Globe, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const { theme } = useTheme()

  const sections = [
    {
      icon: Shield,
      title: '1. Information We Collect',
      content: 'We collect personal information that you voluntarily provide to us when enrolling in courses, scheduling trial classes, signing up for our newsletter, or contacting us. This includes your name, email address, phone number, physical address, and payment information (processed securely through Razorpay).'
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: 'We use your information to facilitate course enrollment, manage trial bookings, process secure payments, communicate announcements, send notifications, improve our LMS platform, and fulfill administrative compliance metrics (including Trinity College London certification registrations).'
    },
    {
      icon: Lock,
      title: '3. Data Protection and Security',
      content: 'We implement rigorous technical and organizational security measures to protect your personal data. Payment details are processed exclusively through Razorpay API connections. We do not store credit card credentials, pins, or passwords on our servers.'
    },
    {
      icon: Globe,
      title: '4. Third-Party Sharing',
      content: 'We do not sell, trade, or transfer your personal data to outside parties. Your data is shared only with trusted services that assist in operating our website, conducting our business, or serving our students (such as Razorpay, Nodemailer SMTP servers, and academic registry boards).'
    },
    {
      icon: FileText,
      title: '5. Cookies and Analytics',
      content: 'We use cookies and equivalent tracking technologies to enhance user experiences, remember authentication sessions, analyze website traffic trends, and customize portal layouts. You can manage cookie consents directly through your browser configurations.'
    }
  ]

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
            Legal Document
          </span>
          <h1 id="privacy-title" className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Last Updated: August 2026. Learn how we handle, secure, and protect your personal information at 2nd Inversion.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        <div className={`rounded-3xl p-8 md:p-12 border shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/80 border-gray-700/80' : 'bg-white border-[#E6EEFF]'
        }`}>
          
          <div className="space-y-12">
            {sections.map((sect, index) => (
              <section key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <sect.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{sect.title}</h2>
                </div>
                <p className={`text-sm leading-relaxed pl-13 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-650'
                }`}>
                  {sect.content}
                </p>
              </section>
            ))}
          </div>

          <div className="border-t border-gray-200/20 mt-12 pt-8 text-center space-y-4">
            <p className="text-xs text-slate-400 font-medium">
              If you have any questions or concern regarding this policy, contact our registrar at <Link href="mailto:aamrule90@gmail.com" className="text-purple-500 hover:underline">aamrule90@gmail.com</Link>
            </p>
            <div className="pt-2">
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
