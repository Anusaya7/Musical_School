'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  Copy, 
  Check, 
  Navigation, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Music, 
  Award, 
  Mic, 
  Headphones, 
  ArrowRight,
  Loader2
} from 'lucide-react'

export default function ContactPage() {
  const { settings } = useSiteSettings()
  const contactDetails = settings.contact_details || {}
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [smtpWarning, setSmtpWarning] = useState(false)

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.'
    } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits).'
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a purpose.'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('Please correct validation errors.', 'error')
      }
      return
    }

    setIsSubmitting(true)
    setSmtpWarning(false)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          purpose: formData.subject,
          message: formData.message
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      // Success
      setIsSubmitted(true)
      if (data.smtpMissing || !data.emailSent) {
        setSmtpWarning(true)
      }

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('Inquiry submitted successfully.', 'success')
      }

      // Open WhatsApp Click-to-Chat in new window
      const whatsappMsg = `Hello,

A new inquiry has been submitted.

Name:
${formData.name}

Phone:
${formData.phone}

Email:
${formData.email}

Purpose:
${formData.subject}

Message:
${formData.message}

Submitted from the website.`

      const cleanPhone = contactDetails.phone ? contactDetails.phone.replace(/\D/g, '') : "917768838832"
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`
      
      try {
        window.open(waUrl, '_blank')
      } catch (waErr) {
        console.error('Failed to open WhatsApp Click-to-Chat:', waErr)
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('Could not open WhatsApp window automatically.', 'info')
        }
      }

      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

    } catch (err: any) {
      console.error('Submit error:', err)
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(err.message || 'An error occurred during submission.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field-specific error inline
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const fullAddress = contactDetails.address || `Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061, Maharashtra, India`

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setAddressCopied(true)
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast('Address copied successfully.', 'success')
    }
    setTimeout(() => setAddressCopied(false), 3000)
  }

  const handleCallNow = (e: React.MouseEvent) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      return
    }

    // On Desktop, trigger check if we blurred. If not, inform the user about system calling configuration.
    let blurred = false
    const handleBlur = () => { blurred = true }
    window.addEventListener('blur', handleBlur)
    setTimeout(() => {
      window.removeEventListener('blur', handleBlur)
      if (!blurred) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('Phone dialing is available only on devices or systems with a configured calling application.', 'info')
        }
      }
    }, 1500)
  }

  const handleSendEmail = (e: React.MouseEvent) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      return
    }

    // On Desktop, trigger check if default email client opened (blurs window). If not, inform the user.
    let blurred = false
    const handleBlur = () => { blurred = true }
    window.addEventListener('blur', handleBlur)
    setTimeout(() => {
      window.removeEventListener('blur', handleBlur)
      if (!blurred) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('No email application found on this device. Please copy address manually.', 'info')
        }
      }
    }, 1550)
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800 font-sans">
      <Header />
      
      {/* Dynamic Keyframes and Animations injected safely */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-y-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }
        @keyframes float-y-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-3deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-1 {
          animation: float-y-slow 7s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-y-reverse 8s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .premium-shadow {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }
        .premium-hover {
          transition: all 0.35s ease;
        }
        .premium-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
        }
      `}} />

      <main className="pt-20">
        
        {/* HERO SECTION */}
        <section className="relative bg-[#FFFFFF] py-24 overflow-hidden border-b border-[#E5E7EB] flex items-center justify-center">
          {/* Subtle gradient background decorations */}
          <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-gradient-to-tr from-[#38BDF8]/10 to-[#7C3AED]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-[#EC4899]/10 to-[#38BDF8]/5 rounded-full blur-[90px] pointer-events-none" />

          {/* Floating music note illustrations */}
          <div className="absolute top-[25%] left-[15%] text-[#7C3AED]/15 animate-float-1 pointer-events-none hidden md:block">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div className="absolute bottom-[20%] right-[18%] text-[#EC4899]/15 animate-float-2 pointer-events-none hidden md:block">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563EB] border border-blue-100 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              GET IN TOUCH
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Contact Us
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Have questions about admissions, music classes, workshops, or enrollment?<br />
              Our team is here to help you start your musical journey.
            </p>
          </div>
        </section>

        {/* CONTACT INFORMATION CARDS */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* CARD 1: Address (Pink Gradient) */}
            <div className="group bg-white border border-[#E5E7EB] rounded-[24px] p-8 flex flex-col justify-between premium-shadow premium-hover">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#EC4899] to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 mb-6 group-hover:rotate-6 transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">📍 Address</h3>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-semibold">
                  {contactDetails.address || `Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav, Pune – 411061`}
                </div>
              </div>
              <div className="mt-8">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=18%C2%B035%2703.0%22N+73%C2%B048%2743.5%22E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#EC4899] to-pink-600 hover:opacity-95 py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 2: Call Us (Blue Gradient) */}
            <div className="group bg-white border border-[#E5E7EB] rounded-[24px] p-8 flex flex-col justify-between premium-shadow premium-hover">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#38BDF8] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 group-hover:rotate-6 transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">📞 Call Us</h3>
                <p className="text-2xl font-black text-[#2563EB] mb-3 tracking-tight">
                  {contactDetails.phone || "+91 77688 38832"}
                </p>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  Tuesday – Sunday<br />
                  4:00 AM – 12:00 PM & 3:00 PM – 9:00 PM
                </p>
              </div>
              <div className="mt-8">
                <a 
                  href={`tel:${contactDetails.phone ? contactDetails.phone.replace(/\s+/g, '') : "+917768838832"}`}
                  onClick={handleCallNow}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#38BDF8] hover:opacity-95 py-3.5 px-4 rounded-xl shadow-md transition-all w-full text-center active:scale-[0.98]"
                >
                  <span>Call Now</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 3: Email (Purple Gradient) */}
            <div className="group bg-white border border-[#E5E7EB] rounded-[24px] p-8 flex flex-col justify-between premium-shadow premium-hover">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6 group-hover:rotate-6 transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">✉ Email</h3>
                <p className="text-lg font-bold text-[#7C3AED] truncate mb-3 tracking-tight">
                  {contactDetails.email || "aamrule90@gmail.com"}
                </p>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  We'll reply within 24 hours.
                </p>
              </div>
              <div className="mt-8">
                <a 
                  href={`mailto:${contactDetails.email || "aamrule90@gmail.com"}?subject=Website%20Inquiry&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20music%20classes.%0A%0ARegards,`}
                  onClick={handleSendEmail}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-purple-600 hover:opacity-95 py-3.5 px-4 rounded-xl w-full text-center active:scale-[0.98]"
                >
                  <span>Send Email</span>
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CARD 4: Contact Person (Orange/Amber Gradient) */}
            <div className="group bg-white border border-[#E5E7EB] rounded-[24px] p-8 flex flex-col justify-between premium-shadow premium-hover">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 group-hover:rotate-6 transition-all duration-300">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">👤 Contact Person</h3>
                <p className="font-extrabold text-slate-800 text-base mb-1">
                  Ajinkya Uddhav Amrule
                </p>
                <span className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md tracking-wider mb-4">
                  Administrator
                </span>
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <p className="text-xs font-bold text-[#0F1E4A] uppercase tracking-wider">Office Hours</p>
                      
                      {/* Monday Closed Badge */}
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-red-50 border border-red-100 text-red-600 shadow-sm">
                          Monday: Closed
                        </span>
                      </div>

                      {/* Tuesday – Sunday Timings Box */}
                      <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-100/50 rounded-2xl p-3.5 space-y-2">
                        <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest">Tuesday – Sunday</p>
                        <div className="text-xs text-slate-600 font-semibold space-y-1">
                          <p className="flex items-center gap-1.5">
                            <span>🌅</span> Morning: 4:00 AM – 12:00 PM
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span>🌇</span> Evening: 3:00 PM – 9:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHY CONTACT US FEATURE GRID */}
        <section className="py-20 bg-slate-50/50 border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                OUR FEATURES
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
                Why Contact Our Academy?
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899] rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#EC4899] flex items-center justify-center mb-6 group-hover:bg-[#EC4899] group-hover:text-white transition-all">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🎵 Professional Music Training</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Comprehensive training systems covering practical exercises, music theory, and instrument techniques.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🎹 Experienced Instructors</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Learn directly from qualified masters, professionals, and conservatory-trained educators.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🎼 Flexible Timings</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Book private classes or workshops based on your customized schedule and convenience.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#EC4899] flex items-center justify-center mb-6 group-hover:bg-[#EC4899] group-hover:text-white transition-all">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🏆 Certification Programs</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Prepare for accredited exams, certifications, and international standard assessments.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🎧 Modern Learning Environment</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  A premium acoustic space equipped with top-tier grand pianos, digital controllers, and equipment.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">🎤 Performance Opportunities</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Regular recitals, musical showcase events, and live workshops to build real-world confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM & GOOGLE MAP SECTIONS */}
        <section className="py-24 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[24px] border border-[#E5E7EB] premium-shadow p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899]" />
                
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                  Send Us a Message
                </h2>
                <p className="text-slate-500 text-sm font-semibold mb-8">
                  Got a custom inquiry? Drop us a line below, and we'll reach back within 24 hours.
                </p>

                {isSubmitted ? (
                  <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-[#E5E7EB]">
                    <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank you!</h3>
                    <p className="text-slate-600 font-semibold max-w-md mx-auto mb-6">
                      Your inquiry has been submitted successfully. We will contact you within 24 hours.
                    </p>
                    {smtpWarning && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold max-w-md mx-auto mb-8 leading-relaxed">
                        ⚠️ Note: Email delivery requires local SMTP configuration. The inquiry has been saved successfully in the database.
                      </div>
                    )}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899] text-white font-bold rounded-xl shadow-md active:scale-95 text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3.5 rounded-xl border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#2563EB]'} focus:ring-2 ${errors.name ? 'focus:ring-red-500/15' : 'focus:ring-[#2563EB]/15'} transition-all outline-none bg-slate-50/30 focus:bg-white text-slate-800 text-sm font-medium shadow-sm`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#2563EB]'} focus:ring-2 ${errors.email ? 'focus:ring-red-500/15' : 'focus:ring-[#2563EB]/15'} transition-all outline-none bg-slate-50/30 focus:bg-white text-slate-800 text-sm font-medium shadow-sm`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3.5 rounded-xl border ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#2563EB]'} focus:ring-2 ${errors.phone ? 'focus:ring-red-500/15' : 'focus:ring-[#2563EB]/15'} transition-all outline-none bg-slate-50/30 focus:bg-white text-slate-800 text-sm font-medium shadow-sm`}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">
                          Purpose *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3.5 rounded-xl border ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#2563EB]'} focus:ring-2 ${errors.subject ? 'focus:ring-red-500/15' : 'focus:ring-[#2563EB]/15'} transition-all outline-none bg-slate-50/30 focus:bg-white text-slate-850 text-sm font-medium shadow-sm`}
                        >
                          <option value="">Select a purpose</option>
                          <option value="Admission">Admission</option>
                          <option value="Music Classes">Music Classes</option>
                          <option value="Instrument Inquiry">Instrument Inquiry</option>
                          <option value="Workshop">Workshop</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                        {errors.subject && (
                          <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.subject}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={`w-full px-4 py-3.5 rounded-xl border ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#2563EB]'} focus:ring-2 ${errors.message ? 'focus:ring-red-500/15' : 'focus:ring-[#2563EB]/15'} transition-all outline-none bg-slate-50/30 focus:bg-white text-slate-800 text-sm font-medium shadow-sm`}
                        placeholder="Tell us how we can help you..."
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.message}</p>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl transition-all duration-200 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899] hover:opacity-95 text-white active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none min-h-[44px] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Map Section Column */}
            <div className="lg:col-span-5 space-y-6 w-full">
              <div className="bg-white rounded-[24px] border border-[#E5E7EB] premium-shadow p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#38BDF8] to-[#7C3AED]" />
                
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2563EB]" />
                  <span>Find Our Academy</span>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mb-4">Visit our music academy.</p>

                {/* Map Iframe */}
                <div className="relative rounded-[16px] overflow-hidden h-[320px] border border-[#E5E7EB] bg-slate-100 shadow-inner transition-all duration-500 hover:scale-[1.005] hover:shadow-lg group">
                  <iframe
                    src="https://maps.google.com/maps?q=18.584167,73.812083&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 rounded-[16px]"
                    allowFullScreen
                    loading="lazy"
                    title="Ajinkya Uddhav Amrule Office Location Map"
                  />
                  
                  {/* Floating Marker Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 border border-[#E5E7EB] rounded-xl shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full animate-ping" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Ajinkya Uddhav Amrule Office</p>
                        <p className="text-[9px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                          Sr. No. 56/2/30, House No. B2/30, Kawade Nagar,<br />
                          Lane No. 2, Behind Ganesh Mangal Kendra
                        </p>
                      </div>
                    </div>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=18%C2%B035%2703.0%22N+73%C2%B048%2743.5%22E"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:text-[#7C3AED] transition"
                      title="Open Google Maps in a new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Premium Location Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {/* Get Directions */}
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=18%C2%B035%2703.0%22N+73%C2%B048%2743.5%22E"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-95 shadow-md transition-all active:scale-[0.98]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>

                  {/* Call Now */}
                  <a
                    href="tel:+917768838832"
                    onClick={handleCallNow}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#2563EB] bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition-all active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>

                  {/* Send Email */}
                  <a
                    href="mailto:aamrule90@gmail.com?subject=Website%20Inquiry&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20music%20classes.%0A%0ARegards,"
                    onClick={handleSendEmail}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#2563EB] bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition-all active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>

                  {/* Copy Address */}
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-[#2563EB] bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition-all active:scale-[0.98]"
                  >
                    {addressCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SOCIAL MEDIA SECTION */}
        <section className="py-16 text-center border-t border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-widest">Connect with Us</h2>
          <p className="text-slate-500 text-sm font-semibold mb-8">Follow our social channels and stay updated.</p>
          
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-[#2563EB] hover:border-[#2563EB]/40 hover:shadow-md hover:scale-110 transition-all duration-300"
              title="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-[#EC4899] hover:border-[#EC4899]/40 hover:shadow-md hover:scale-110 transition-all duration-300"
              title="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-[#EC4899] hover:border-[#EC4899]/40 hover:shadow-md hover:scale-110 transition-all duration-300"
              title="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 00-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 002.11-2.107c.502-1.89.502-5.837.502-5.837s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/917768838832" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-green-600 hover:border-green-200 hover:shadow-lg hover:scale-110 transition-all duration-300"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 2.688 1.425 4.75 1.426 5.516 0 10.007-4.49 10.01-10.009.002-2.673-1.025-5.187-2.894-7.06C16.592 1.639 14.09 .612 11.998.611 6.48.611 1.99 5.1 1.987 10.62c0 2.12.56 3.73 1.63 5.482l-.994 3.635 3.72-.976z"/></svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-500 hover:text-[#7C3AED] hover:border-[#7C3AED]/40 hover:shadow-md hover:scale-110 transition-all duration-300"
              title="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
            </a>
          </div>
        </section>

        {/* FOOTER CTA SECTION */}
        <section className="py-16 px-4">
          <div className="bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-slate-900 text-white py-20 px-8 rounded-[24px] overflow-hidden text-center max-w-7xl mx-auto shadow-xl relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                Ready to Begin Your Musical Journey?
              </h2>
              <p className="text-lg text-blue-200/90 mb-8 font-medium max-w-xl mx-auto">
                Join our academy and discover your musical talent with expert guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/booking"
                  className="px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg transition active:scale-[0.98] text-sm"
                >
                  Enroll Now
                </a>
                <button
                  onClick={() => {
                    const formElement = document.querySelector('form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition active:scale-[0.98] text-sm"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
