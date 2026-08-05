import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !session.user) {
    console.log('[ADMIN LAYOUT] Unauthenticated server session. Redirecting to login.')
    redirect('/admin/login')
  }

  const role = (session.user as any).role?.toUpperCase()
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    console.warn('[ADMIN LAYOUT] Access denied for role:', role)
    redirect('/unauthorized')
  }

  return <>{children}</>
}
