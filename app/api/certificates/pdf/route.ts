import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const certNumber = searchParams.get('certNumber')

    if (!certNumber) {
      return new NextResponse('Certificate number is required', { status: 400 })
    }

    const cert = await prisma.certificate.findUnique({
      where: { certNumber }
    })

    if (!cert) {
      return new NextResponse('Certificate not found', { status: 404 })
    }

    const dateStr = cert.issueDate
      ? new Date(cert.issueDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : new Date().toLocaleDateString('en-IN')

    const qrCodeUrl = cert.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(cert.certNumber)}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Certificate of Completion - ${cert.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Montserrat:wght@400;500;600;700&display=swap');
            body {
              margin: 0;
              padding: 20px;
              background-color: #0b0f19;
              font-family: 'Montserrat', sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-h: 100vh;
            }
            .no-print {
              margin-bottom: 20px;
            }
            .btn-print {
              background: linear-gradient(135deg, #6366f1, #a855f7);
              color: white;
              border: none;
              padding: 12px 28px;
              font-size: 15px;
              font-weight: 700;
              border-radius: 12px;
              cursor: pointer;
              box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
              transition: transform 0.2s;
            }
            .btn-print:hover {
              transform: scale(1.05);
            }
            .cert-card {
              width: 900px;
              height: 620px;
              background: #0f172a;
              border: 12px solid #1e293b;
              border-image: linear-gradient(to bottom right, #e2e8f0, #6366f1, #3b82f6) 1;
              position: relative;
              padding: 40px 60px;
              box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
              box-sizing: border-box;
              text-align: center;
              overflow: hidden;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 180px;
              opacity: 0.03;
              font-family: 'Cinzel', serif;
              pointer-events: none;
            }
            .header-subtitle {
              font-family: 'Cinzel', serif;
              font-size: 14px;
              letter-spacing: 6px;
              color: #94a3b8;
              text-transform: uppercase;
              margin-top: 10px;
            }
            .cert-title {
              font-family: 'Cinzel', serif;
              font-size: 38px;
              font-weight: 900;
              background: linear-gradient(135deg, #f8fafc, #cbd5e1);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin: 15px 0 5px 0;
              letter-spacing: 2px;
            }
            .presented-to {
              font-size: 14px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 3px;
              margin-top: 25px;
            }
            .student-name {
              font-family: 'Cinzel', serif;
              font-size: 42px;
              font-weight: 700;
              color: #60a5fa;
              margin: 10px 0 15px 0;
              border-bottom: 2px solid rgba(96, 165, 250, 0.3);
              display: inline-block;
              padding-bottom: 8px;
            }
            .cert-body {
              font-size: 15px;
              color: #cbd5e1;
              line-height: 1.6;
              max-width: 680px;
              margin: 0 auto;
            }
            .course-name {
              color: #a855f7;
              font-weight: 700;
            }
            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 45px;
              padding-top: 20px;
              border-top: 1px solid #1e293b;
            }
            .footer-block {
              text-align: left;
            }
            .footer-block.right {
              text-align: right;
            }
            .sig-line {
              width: 180px;
              border-bottom: 1px solid #475569;
              margin-bottom: 8px;
            }
            .sig-name {
              font-weight: 700;
              font-size: 13px;
              color: #f8fafc;
            }
            .sig-title {
              font-size: 11px;
              color: #64748b;
            }
            .qr-code img {
              width: 90px;
              height: 90px;
              border-radius: 8px;
              border: 2px solid #334155;
              padding: 4px;
              background: white;
            }
            .cert-no {
              font-size: 11px;
              color: #64748b;
              margin-top: 4px;
              font-family: monospace;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .no-print {
                display: none;
              }
              .cert-card {
                box-shadow: none;
                background: white;
                color: #000;
                border-color: #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="btn-print" onclick="window.print()">Print / Download PDF</button>
          </div>
          
          <div class="cert-card">
            <div class="watermark">🎵</div>
            
            <div class="header-subtitle">2ND INVERSION MUSICAL SCHOOL</div>
            <div class="cert-title">CERTIFICATE OF COMPLETION</div>
            
            <div class="presented-to">This is proudly presented to</div>
            <div class="student-name">${cert.studentName}</div>
            
            <div class="cert-body">
              For successfully completing the comprehensive professional performance curriculum in
              <br/>
              <span class="course-name">${cert.courseName}</span>
              <br/>
              demonstrating outstanding musical mastery and technical proficiency.
            </div>

            <div class="cert-footer">
              <div class="footer-block">
                <div class="sig-line"></div>
                <div class="sig-name">Ajinkya Amrule</div>
                <div class="sig-title">Senior Academic Director</div>
              </div>

              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="Verification QR Code" />
                <div class="cert-no">${cert.certNumber}</div>
              </div>

              <div class="footer-block right">
                <div class="sig-line" style="margin-left: auto;"></div>
                <div class="sig-name">${dateStr}</div>
                <div class="sig-title">Date of Issuance</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
