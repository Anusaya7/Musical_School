import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/(dashboard)', '/api/private/'],
    },
    sitemap: 'https://musical-school-nine.vercel.app/sitemap.xml',
  }
}
