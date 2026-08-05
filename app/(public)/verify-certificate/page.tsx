'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Header from '@/components/Header'
import { Award, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'

function VerifyCertificateContent() {
  const searchParams = useSearchParams()
  const certNumber = searchParams.get('certNumber')
  const [certData, setCertData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!certNumber) {
      setLoading(false)
      setError('No certificate number provided.')
      return
    }

    fetch(`/api/certificates?certNumber=${certNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.certificate) {
          setCertData(data.certificate)
        } else {
          setError(data.error || 'Certificate record not found in official database.')
        }
      })
      .catch(err => setError('Failed to verify certificate.'))
      .finally(() => setLoading(false))
  }, [certNumber])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E4A] via-[#1a2d61] to-[#0A1435] text-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-32 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl text-center space-y-6">
          
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-white">
            <Award size={44} />
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Official Certificate Verification
          </h1>

          {loading && (
            <p className="text-blue-300 font-medium animate-pulse">
              Verifying authentic credentials against school registry...
            </p>
          )}

          {!loading && error && (
            <div className="bg-red-500/20 border border-red-500/40 p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-lg">
                <XCircle size={24} />
                Verification Failed
              </div>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          )}

          {!loading && certData && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-4 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg justify-center pb-2 border-b border-emerald-500/20">
                <CheckCircle2 size={24} />
                Authentic Credential Verified
              </div>

              <div className="space-y-2 text-sm text-gray-200">
                <p><strong className="text-white">Certificate Number:</strong> <span className="font-mono text-purple-300">{certData.certNumber}</span></p>
                <p><strong className="text-white">Student Name:</strong> {certData.studentName}</p>
                <p><strong className="text-white">Course Completed:</strong> {certData.courseName}</p>
                <p><strong className="text-white">Issue Date:</strong> {new Date(certData.issueDate).toLocaleDateString('en-IN')}</p>
                <p><strong className="text-white">Issuing Authority:</strong> 2nd Inversion Musical School</p>
              </div>

              <div className="pt-4 text-center">
                <a
                  href={`/api/certificates/pdf?certNumber=${certData.certNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
                >
                  <ExternalLink size={18} />
                  View Original Certificate PDF
                </a>
              </div>
            </div>
          )}

          <div className="pt-4 text-xs text-slate-400">
            2nd Inversion Musical School • Academic Registrar Record Verification
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1E4A] flex items-center justify-center text-white">Loading verification details...</div>}>
      <VerifyCertificateContent />
    </Suspense>
  )
}
