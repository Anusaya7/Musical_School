import './globals.css'
import Script from 'next/script'
import Providers from '@/components/Providers'

const inter = { className: 'antialiased font-sans' }

export const metadata = {
  title: '2nd Inversion Musical School',
  description: 'AI-powered music school platform with smart booking and practice system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MusicSchool',
              'name': '2nd Inversion Musical School',
              'url': 'https://musical-school-nine.vercel.app',
              'logo': 'https://musical-school-nine.vercel.app/images/logo_emblem.png',
              'founder': {
                '@type': 'Person',
                'name': 'Ajinkya Uddhav Amrule'
              },
              'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'customer service',
                'telephone': '+91-77688-38832',
                'email': 'aamrule90@gmail.com'
              },
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi)',
                'addressLocality': 'Pune',
                'addressRegion': 'Maharashtra',
                'postalCode': '411061',
                'addressCountry': 'IN'
              },
              'telephone': '+91-77688-38832',
              'email': 'aamrule90@gmail.com'
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
