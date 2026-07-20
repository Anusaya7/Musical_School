import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://musical-school-nine.vercel.app'

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
    '/practice'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}
