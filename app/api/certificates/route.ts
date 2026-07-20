import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const certNumber = searchParams.get('certNumber')

    if (certNumber) {
      const cert = await prisma.certificate.findUnique({
        where: { certNumber }
      })
      if (!cert) {
        return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, certificate: cert })
    }

    if (email) {
      const certs = await prisma.certificate.findMany({
        where: { studentEmail: email },
        orderBy: { issueDate: 'desc' }
      })
      return NextResponse.json({ success: true, certificates: certs })
    }

    const allCerts = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' },
      take: 50
    })
    return NextResponse.json({ success: true, certificates: allCerts })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentEmail, studentName, courseId, courseName } = body

    if (!studentEmail || !courseId || !courseName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const certNumber = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      `https://musical-school-nine.vercel.app/verify-certificate?certNumber=${certNumber}`
    )}`

    const newCert = await prisma.certificate.create({
      data: {
        certNumber,
        studentEmail,
        studentName: studentName || studentEmail.split('@')[0],
        courseId,
        courseName,
        qrCodeUrl,
        pdfUrl: `/api/certificates/pdf?certNumber=${certNumber}`
      }
    })

    return NextResponse.json({ success: true, certificate: newCert })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
