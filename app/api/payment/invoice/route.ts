import { NextRequest, NextResponse } from 'next/server'
import { getPayments } from '@/lib/db'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const email = session?.user?.email?.toLowerCase()
    if (!email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const role = String((session?.user as { role?: string })?.role || '').toUpperCase()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Payment ID is required', { status: 400 })
    }

    const payments = await getPayments()
    const payment = payments.find(p => p.id === id || p.paymentId === id)

    if (!payment) {
      return new NextResponse('Invoice not found', { status: 404 })
    }

    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
    if (!isAdmin && payment.studentEmail?.toLowerCase() !== email) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const amount = payment.amount
    // Calculate simple mock GST (18%) and subtotal
    const subtotal = Math.round(amount / 1.18)
    const gst = amount - subtotal
    const dateStr = payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : new Date().toLocaleDateString('en-IN')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice - ${payment.invoiceNumber || 'Receipt'}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 40px;
              line-height: 1.6;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
              border-radius: 10px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #6d28d9;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #6d28d9;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .title {
              text-align: right;
            }
            .title h1 {
              margin: 0;
              font-size: 28px;
              color: #1e293b;
            }
            .details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
              font-size: 14px;
            }
            .details div {
              flex: 1;
            }
            .details .right {
              text-align: right;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            th {
              background-color: #f8fafc;
              border-bottom: 2px solid #e2e8f0;
              font-weight: bold;
              text-align: left;
              padding: 12px;
              font-size: 14px;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }
            .totals {
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 300px;
              margin-bottom: 0;
            }
            .totals-table td {
              border-bottom: none;
              padding: 6px 12px;
            }
            .totals-table .grand-total {
              font-size: 18px;
              font-weight: bold;
              color: #6d28d9;
              border-top: 2px solid #e2e8f0;
              padding-top: 12px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 0;
              }
              .invoice-box {
                border: none;
                box-shadow: none;
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
            .no-print {
              text-align: center;
              margin-bottom: 20px;
            }
            .btn-print {
              background-color: #6d28d9;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 14px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgba(109, 40, 217, 0.3);
              transition: background-color 0.2s;
            }
            .btn-print:hover {
              background-color: #5b21b6;
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
          </div>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">
                <span>🎵</span> 2ND INVERSION
              </div>
              <div class="title">
                <h1>INVOICE</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">No: ${payment.invoiceNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div class="details">
              <div>
                <strong>Billed To:</strong><br />
                ${payment.studentName}<br />
                Email: ${payment.studentEmail}<br />
              </div>
              <div class="right">
                <strong>Provider:</strong><br />
                2nd Inversion Music School<br />
                Email: aamrule90@gmail.com<br />
                Date: ${dateStr}
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${payment.courseName} Course Access (Online Portal)</td>
                  <td>1</td>
                  <td style="text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
                  <td style="text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="totals">
              <table class="totals-table">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>GST (18%):</td>
                  <td style="text-align: right;">₹${gst.toLocaleString('en-IN')}</td>
                </tr>
                <tr class="grand-total">
                  <td>Total Paid:</td>
                  <td style="text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 40px; font-size: 12px; color: #64748b; background-color: #f8fafc; padding: 15px; border-radius: 8px;">
              <strong>Payment Metadata:</strong><br/>
              Order ID: ${payment.orderId}<br/>
              Payment ID: ${payment.paymentId}<br/>
              Transaction Status: SUCCESS
            </div>
            
            <div class="footer">
              Thank you for learning with 2ND INVERSION Musical School!
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
    console.error('Error generating invoice:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
