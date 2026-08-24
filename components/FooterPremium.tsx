'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import logoEmblem from '@/public/images/logo_emblem.png'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import {
  Music,
  Home,
  BookOpen,
  Users,
  Info,
  Phone,
  Mail,
  MapPin,
  Send,
  Star,
  Piano,
  Guitar,
  Mic
} from 'lucide-react'

export default function FooterPremium() {
  const [email, setEmail] = useState('')
  const { settings } = useSiteSettings()
  const router = useRouter()

  const contactDetails = settings.contact_details || {}
  const footerSettings = settings.footer || {}

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  const socialLinks = [
    { name: 'IG', href: contactDetails.instagram || '#', color: 'hover:bg-pink-500' },
    { name: 'YT', href: contactDetails.youtube || '#', color: 'hover:bg-red-500' },
    { name: 'FB', href: contactDetails.facebook || '#', color: 'hover:bg-blue-500' },
    { name: 'TW', href: contactDetails.twitter || '#', color: 'hover:bg-sky-500' }
  ]

  const quickLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Instructors', href: '/instructor-profile', icon: Users },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone }
  ]

  const topCourses = [
    { name: 'Piano Fundamentals', href: '/courses?search=piano', icon: Piano },
    { name: 'Guitar Mastery', href: '/courses?search=guitar', icon: Guitar },
    { name: 'Vocal Training', href: '/courses?search=vocals', icon: Mic }
  ]


  return (
    <>
      {/* Mini CTA Strip */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-1">Start Your Musical Journey Today</h3>
              <p className="text-white/80">Join 10,000+ students mastering music with us</p>
            </div>
            <button 
              onClick={() => router.push('/contact')}
              className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Book Free Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative bg-gradient-to-b from-gray-900 via-black to-purple-950/50">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px)`
          }} />
        </div>

        {/* Floating Glowing Dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105" style={{ filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.18))' }}>
                  <Image
                    src={logoEmblem}
                    alt="2nd Inversion Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">2nd Inversion</h3>
                  <p className="text-purple-300 text-sm">Musical School</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {footerSettings.footerText || "Learn piano, guitar, vocals & more with expert instructors."}
              </p>

              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium">
                  Rated 4.8 by 10,000+ students
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-all duration-300 group"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-purple-400" />
                      <span className="relative group-hover:text-purple-400">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Courses */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Top Courses</h4>
              <ul className="space-y-3">
                {topCourses.map((course) => (
                  <li key={course.name}>
                    <Link
                      href={course.href}
                      prefetch={false}
                      className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-all duration-300 group"
                    >
                      <course.icon className="w-4 h-4 group-hover:text-purple-400" />
                      <span className="relative group-hover:text-purple-400">
                        {course.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact & Newsletter</h4>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href={`tel:${(contactDetails.phone || "+91 77688 38832").replace(/\s+/g, '')}`} className="hover:text-purple-400 transition-colors">
                    {contactDetails.phone || "+91 77688 38832"}
                  </a>
                </div>
                <div className="flex items-start space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <a 
                    href="https://maps.google.com/?q=Sr.+No.+56/2/30,+House+No.+B2/30,+Kawade+Nagar,+Lane+No.+2,+Behind+Ganesh+Mangal+Kendra,+Pimple+Gurav+(New+Sangvi),+Pune+-+411061,+Maharashtra,+India" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs leading-relaxed hover:text-purple-400 transition-colors"
                  >
                    {contactDetails.address || "Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061, Maharashtra, India"}
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href={`mailto:${contactDetails.email || "aamrule90@gmail.com"}`} className="hover:text-purple-400 transition-colors">
                    {contactDetails.email || "aamrule90@gmail.com"}
                  </a>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <p className="text-gray-300 text-sm font-medium">Subscribe to our newsletter</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:shadow-lg hover:shadow-purple-500/25 hover:scale-110`}
              >
                <span className="text-white font-bold text-sm">{social.name}</span>
              </a>
            ))}
          </div>

          {/* Divider Line */}
          <div className="relative h-px mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              {footerSettings.copyrightText || "© 2026 2nd Inversion Musical School. All rights reserved."}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-purple-400 transition-colors">
                FAQ
              </Link>
              <a href="/sitemap.xml" className="text-gray-400 hover:text-purple-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
