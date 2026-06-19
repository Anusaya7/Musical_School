'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any).role?.toUpperCase()
      if (role !== 'STUDENT' && role !== 'INSTRUCTOR' && role !== 'SUPER_ADMIN') {
        window.location.replace('/unauthorized')
        return
      }
      setLoading(false)
      return
    }

    const savedUserStr = localStorage.getItem('user')
    if (!savedUserStr) {
      window.location.replace('/login')
      return
    }
    try {
      const savedUser = JSON.parse(savedUserStr)
      const role = savedUser.role?.toUpperCase()
      if (role !== 'STUDENT' && role !== 'INSTRUCTOR' && role !== 'SUPER_ADMIN') {
        window.location.replace('/unauthorized')
        return
      }
      setLoading(false)
    } catch (e) {
      window.location.replace('/login')
    }
  }, [session, status])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5EA8FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying student access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
