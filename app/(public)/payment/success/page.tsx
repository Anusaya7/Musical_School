'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { CheckCircle2, Download, Home, LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingId = searchParams.get('bookingId') || 'BK-UNKNOWN'
  const courseName = searchParams.get('courseName') || 'Music Course'
  const paymentId = searchParams.get('paymentId') || 'TXN-UNKNOWN'
  const amount = Number(searchParams.get('amount') || 0)

  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${bookingId}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
              .receipt-box { max-width: 600px; margin: 0 auto; border: 1.5px solid #e2e8f0; padding: 30px; border-radius: 12px; }
              h1 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0; }
              .item { display: flex; justify-content: space-between; margin: 12px 0; font-size: 14px; }
              .label { font-weight: bold; color: #64748b; }
              .val { font-weight: 800; color: #0f1e4a; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="receipt-box">
              <h1>2nd Inversion Music School</h1>
              <h3>Payment Receipt (Paid)</h3>
              <div class="item"><span class="label">Booking ID:</span><span class="val">${bookingId}</span></div>
              <div class="item"><span class="label">Course Name:</span><span class="val">${courseName}</span></div>
              <div class="item"><span class="label">Payment Transaction ID:</span><span class="val">${paymentId}</span></div>
              <div class="item"><span class="label">Total Paid:</span><span class="val">INR ${amount.toLocaleString('en-IN')}</span></div>
              <div class="item"><span class="label">Status:</span><span class="val" style="color: #16a34a;">Success</span></div>
              <div class="footer">Thank you for your purchase. We look forward to seeing you in class!</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans">
      <Header />

      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#E6EEFF] rounded-[32px] p-8 shadow-[0_15px_50px_rgba(94,168,255,0.06)] text-center space-y-8 animate-scaleUp">
          
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#0F1E4A] tracking-tight">Payment Successful!</h1>
            <p className="text-xs font-semibold text-slate-400">Your class slot has been booked and confirmed.</p>
          </div>

          <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[24px] p-5 text-left text-xs space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Course</span>
              <span className="font-extrabold text-[#0F1E4A]">{courseName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Booking ID</span>
              <span className="font-extrabold text-[#0F1E4A]">{bookingId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Transaction ID</span>
              <span className="font-medium text-[#0F1E4A] truncate max-w-[180px]">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#E6EEFF] pt-3.5 text-sm">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Amount Paid</span>
              <span className="font-black text-[#2563EB]">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadReceipt}
              className="w-full h-12 bg-white border border-[#E6EEFF] hover:border-[#2563EB] hover:bg-[#FAFBFF] text-[#0F1E4A] rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>

            <Link
              href="/student/dashboard"
              className="w-full h-12 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4" /> Go To Dashboard
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Back to Home
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
        Loading receipt details...
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
