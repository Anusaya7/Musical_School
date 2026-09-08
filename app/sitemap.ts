import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://2ndinversion.com'

  const routes = [
    '',
    '/courses',
    '/about',
    '/contact',
    '/login',
    '/signup',
    '/admin/login',
    '/instructor',
    '/student/dashboard',
    '/practice',
    '/privacy-policy',
    '/terms',
    '/faq'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}
