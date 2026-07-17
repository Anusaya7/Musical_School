'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { CheckCircle2, Download, Home, LayoutDashboard, BookOpen, Calendar, User, Clock, Sparkles, CreditCard, Loader2 } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [verifiedBooking, setVerifiedBooking] = useState<any>(null)

  const bookingId = searchParams.get('bookingId') || 'BK-UNKNOWN'
  const courseName = decodeURIComponent(searchParams.get('courseName') || 'Music Course')
  const paymentId = searchParams.get('paymentId') || 'TXN-UNKNOWN'
  const amount = Number(searchParams.get('amount') || 0)
  const paymentDate = decodeURIComponent(searchParams.get('paymentDate') || new Date().toLocaleString())
  const studentEmail = decodeURIComponent(searchParams.get('studentEmail') || '')
  const instructorName = decodeURIComponent(searchParams.get('instructorName') || 'Ajinkya Amrule')
  const courseDuration = decodeURIComponent(searchParams.get('courseDuration') || '3 Months')
  const bookedSlot = decodeURIComponent(searchParams.get('bookedSlot') || '')
  const expectedStartDate = decodeURIComponent(searchParams.get('expectedStartDate') || '')

  useEffect(() => {
    if (bookingId === 'BK-UNKNOWN') {
      router.replace(`/payment/failed?error=${encodeURIComponent('No booking ID found in URL parameters.')}`)
      return
    }

    async function verifyWithDb() {
      try {
        const res = await fetch(`/api/bookings?id=${bookingId}`)
        if (!res.ok) {
          throw new Error('Booking verification fetch failed')
        }
        const data = await res.json()
        if (data.status === 'Confirmed' && data.paymentStatus === 'Success') {
          setVerifiedBooking(data)
          setVerifying(false)
        } else {
          router.replace(`/payment/failed?error=${encodeURIComponent('Booking is either unconfirmed or unpaid in our database.')}`)
        }
      } catch (err) {
        console.error('Database verification failed:', err)
        router.replace(`/payment/failed?error=${encodeURIComponent('We could not verify your booking with our servers. Please contact support.')}`)
      }
    }

    verifyWithDb()
  }, [bookingId, router])

  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt_${bookingId}</title>
            <style>
              body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #0f1e4a; background-color: #ffffff; }
              .receipt-container { max-width: 650px; margin: 0 auto; border: 1.5px solid #e6eeff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
              .header { border-bottom: 2px solid #e6eeff; padding-bottom: 20px; margin-bottom: 25px; text-align: center; }
              .header h1 { color: #2563eb; margin: 0; font-size: 26px; font-weight: 900; }
              .header p { color: #64748b; margin: 5px 0 0 0; font-size: 13px; font-weight: 500; }
              .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #2563eb; margin: 25px 0 10px 0; border-bottom: 1px solid #e6eeff; padding-bottom: 5px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
              .item { font-size: 13px; line-height: 1.6; }
              .label { font-weight: 600; color: #64748b; }
              .val { font-weight: 700; color: #0f1e4a; }
              .amount-row { display: flex; justify-content: space-between; align-items: center; background-color: #f5f8ff; border: 1px dashed #2563eb; padding: 15px; border-radius: 12px; margin-top: 30px; }
              .amount-label { font-weight: 800; font-size: 14px; color: #2563eb; }
              .amount-val { font-weight: 900; font-size: 20px; color: #0f1e4a; }
              .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e6eeff; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="header">
                <h1>2ND INVERSION</h1>
                <p>Music School Learning Management System</p>
              </div>

              <div class="section-title">Registration Metadata</div>
              <div class="grid">
                <div class="item"><span class="label">Booking ID:</span> <span class="val">${bookingId}</span></div>
                <div class="item"><span class="label">Receipt Number:</span> <span class="val">INV-${bookingId.substring(3)}</span></div>
                <div class="item"><span class="label">Transaction Date:</span> <span class="val">${paymentDate}</span></div>
                <div class="item"><span class="label">Student Email:</span> <span class="val">${studentEmail}</span></div>
              </div>

              <div class="section-title">Course & Slot Specifications</div>
              <div class="grid">
                <div class="item"><span class="label">Course Name:</span> <span class="val">${courseName}</span></div>
                <div class="item"><span class="label">Instructor:</span> <span class="val">${instructorName}</span></div>
                <div class="item"><span class="label">Course Duration:</span> <span class="val">${courseDuration}</span></div>
                <div class="item"><span class="label">Booked Time Slot:</span> <span class="val">${bookedSlot}</span></div>
                <div class="item"><span class="label">Expected Start Date:</span> <span class="val">${expectedStartDate}</span></div>
              </div>

              <div class="section-title">Payment Verification</div>
              <div class="grid">
                <div class="item"><span class="label">Razorpay Payment ID:</span> <span class="val">${paymentId}</span></div>
                <div class="item"><span class="label">Status:</span> <span class="val" style="color: #16a34a;">VERIFIED (SUCCESS)</span></div>
              </div>

              <div class="amount-row">
                <span class="amount-label">TOTAL PAID (INR)</span>
                <span class="amount-val">₹${amount.toLocaleString('en-IN')}.00</span>
              </div>

              <div class="footer">
                Thank you for your enrollment. This is a computer-generated transaction receipt. 
                For support, contact support@2ndinversion.com.
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex flex-col items-center justify-center font-sans space-y-4">
        <Loader2 className="w-12 h-12 text-[#FF6FAF] animate-spin" />
        <p className="text-sm text-slate-500 font-bold tracking-wide animate-pulse">Verifying booking details with database...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans">
      <Header />

      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-[#E6EEFF] rounded-[32px] p-8 md:p-12 shadow-[0_15px_50px_rgba(94,168,255,0.06)] text-center space-y-10 animate-scaleUp">
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Pulse ripple ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-100/50 border border-emerald-200 animate-ping opacity-75" />
              <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-300">
                <CheckCircle2 className="w-10 h-10 text-white animate-scaleUp" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-600">
                  Payment Verified
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-600">
                  Booking Confirmed
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#0F1E4A] tracking-tight pt-2">Enrollment Completed!</h1>
              <p className="text-sm text-slate-400 font-medium">Your course seat has been successfully reserved.</p>
            </div>
          </div>

          <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[24px] p-6 md:p-8 text-left space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6EEFF] pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Name</span>
                <span className="font-extrabold text-[#0F1E4A] text-lg">{courseName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount Paid</span>
                <span className="font-black text-[#2563EB] text-xl">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Booking ID</span>
                  <span className="font-extrabold text-[#0F1E4A]">{bookingId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Transaction ID</span>
                  <span className="font-extrabold text-[#0F1E4A] truncate max-w-[150px]">{paymentId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Payment ID</span>
                  <span className="font-extrabold text-[#0F1E4A] truncate max-w-[150px]">{paymentId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Instructor</span>
                  <span className="font-extrabold text-[#0F1E4A]">{instructorName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Course Duration</span>
                  <span className="font-extrabold text-[#0F1E4A]">{courseDuration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Booked Slot</span>
                  <span className="font-extrabold text-[#0F1E4A]">{bookedSlot}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Expected Start Date</span>
                  <span className="font-extrabold text-[#0F1E4A]">{expectedStartDate}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6EEFF] pt-4 flex flex-col md:flex-row justify-between gap-2 text-[10px] text-slate-400 font-semibold">
              <div>Transaction Date: {paymentDate}</div>
              <div>Receipt sent to: {studentEmail}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="w-full h-12 bg-white border border-[#E6EEFF] hover:border-[#2563EB] hover:bg-[#FAFBFF] text-[#0F1E4A] rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Download Receipt (PDF)
            </button>

            <Link
              href="/student/dashboard"
              className="w-full h-12 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Student Dashboard
            </Link>

            <Link
              href="/courses"
              className="w-full h-12 bg-white border border-[#E6EEFF] hover:border-[#2563EB] hover:bg-[#FAFBFF] text-[#0F1E4A] rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" /> View My Courses
            </Link>

            <Link
              href="/"
              className="w-full h-12 bg-white border border-[#E6EEFF] hover:border-[#2563EB] hover:bg-[#FAFBFF] text-[#0F1E4A] rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Home className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center font-bold text-sm text-slate-400">
        Loading success details...
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
