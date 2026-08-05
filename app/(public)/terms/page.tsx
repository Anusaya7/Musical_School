'use client'

import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { ShieldCheck, Calendar, Scale, Award, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsAndConditions() {
  const { theme } = useTheme()

  const rules = [
    {
      icon: Info,
      title: '1. Admission & Course Enrollment',
      content: 'By enrolling in 2nd Inversion Music School, students gain access to structured pathways (Beginner, Intermediate, Advanced) led by Ajinkya Amrule. Admissions are open to all passionate learners. Course details, durations, and materials are accessible through the custom student dashboard.'
    },
    {
      icon: Scale,
      title: '2. Payment Terms & Fees',
      content: 'All course fees, registration fees, and materials costs are payable in full before course commencement unless explicitly agreed otherwise. All transactions are securely processed through Razorpay. Fees paid are non-refundable once classes have commenced.'
    },
    {
      icon: Calendar,
      title: '3. Booking Cancellation & Rescheduling',
      content: 'Students can schedule and manage class bookings through the portal. Cancellation or rescheduling requests must be submitted at least 24 hours prior to the scheduled slot. No-shows or late cancellations will result in a forfeited session.'
    },
    {
      icon: ShieldCheck,
      title: '4. Code of Conduct & Intellectual Property',
      content: 'We expect all students, instructors, and visitors to maintain professional conduct. All learning materials, recorded sessions, curriculum modules, and logo emblems are the exclusive intellectual property of 2nd Inversion Music School.'
    },
    {
      icon: Award,
      title: '5. Trinity College London Certification Prep',
      content: 'Our curriculum prepares eligible students for official external examinations (including Trinity College London & ABRSM). Registration for these external assessments is subject to additional registrar guidelines, scheduling availability, and separate exam fees.'
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
            Legal Terms
          </span>
          <h1 id="terms-title" className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Effective Date: August 2026. Please read our guidelines, enrollment requirements, and administrative terms.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        <div className={`rounded-3xl p-8 md:p-12 border shadow-xl ${
          theme === 'dark' ? 'bg-gray-800/80 border-gray-700/80' : 'bg-white border-[#E6EEFF]'
        }`}>
          
          <div className="space-y-12">
            {rules.map((rule, index) => (
              <section key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <rule.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{rule.title}</h2>
                </div>
                <p className={`text-sm leading-relaxed pl-13 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-650'
                }`}>
                  {rule.content}
                </p>
              </section>
            ))}
          </div>

          <div className="border-t border-gray-200/20 mt-12 pt-8 text-center space-y-4">
            <p className="text-xs text-slate-400 font-medium">
              By enrolling or using our site, you confirm you accept these terms. For legal inquiries, contact <Link href="mailto:aamrule90@gmail.com" className="text-purple-500 hover:underline">aamrule90@gmail.com</Link>
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
