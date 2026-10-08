'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react';
import Image from "next/image";
import logoEmblem from "@/public/images/logo_emblem.png"; // Premium transparent logo emblem

export default function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const { status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const loggedIn = isAuthenticated || status === 'authenticated'
  const role = (user?.role || '').toUpperCase()
  const portalHref =
    role === 'SUPER_ADMIN' || role === 'ADMIN'
      ? '/admin'
      : role === 'INSTRUCTOR'
        ? '/instructor'
        : '/student/dashboard'

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const getLinkClass = (path: string) => {
    const active = isActive(path)
    if (theme === 'dark') {
      return `inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
        active 
          ? 'bg-purple-900/40 text-purple-300 border-b-2 border-purple-500 rounded-b-none shadow-sm' 
          : 'text-gray-300 hover:bg-purple-900/30 hover:text-purple-300'
      }`
    } else {
      return `inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
        active 
          ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600 rounded-b-none shadow-sm' 
          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
      }`
    }
  }

  const getMobileLinkClass = (path: string) => {
    const active = isActive(path)
    if (theme === 'dark') {
      return `block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
        active ? 'bg-purple-900/50 text-purple-350 font-bold border-l-4 border-purple-500' : 'text-gray-300 hover:bg-purple-900/30'
      }`
    } else {
      return `block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
        active ? 'bg-purple-100/50 text-purple-600 font-bold border-l-4 border-purple-600' : 'text-gray-700 hover:bg-purple-50'
      }`
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ease-in-out ${isScrolled
        ? theme === 'dark'
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-white/95 backdrop-blur-md shadow-lg'
        : theme === 'dark'
          ? 'bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700'
          : 'bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm'
      }`}>
      <div className="container mx-auto px-4 h-full">
        <div className="h-20 flex items-center justify-between">

          <div className="flex items-center shrink-0 pl-6 pr-7">
            <Link href="/" className="group flex items-center transition-all duration-300 ease-in-out hover:scale-[1.05]">
              {/* Premium Logo (Transparent) */}
              <div className="relative shrink-0 flex items-center justify-center h-[46px] w-[46px] md:h-[54px] md:w-[54px] lg:h-[60px] lg:w-[60px]">
                <Image
                  src={logoEmblem}
                  alt="2nd Inversion Logo"
                  priority
                  className="object-contain transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 4px 10px rgba(212,175,55,0.18))'
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="hidden xl:flex items-center gap-3 flex-nowrap">
            {/* Main Navigation Links */}
            <div className="flex gap-1">
              <Link href="/" prefetch={false} className={getLinkClass('/')}>
                Home
              </Link>
              <Link href="/courses" prefetch={false} className={getLinkClass('/courses')}>
                Courses
              </Link>
              <Link href="/about" prefetch={false} className={getLinkClass('/about')}>
                About
              </Link>
              <Link href="/contact" prefetch={false} className={getLinkClass('/contact')}>
                Contact
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4 border-l border-gray-300 pl-6">
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Role Icons */}
            <div className={`flex items-center space-x-4 border-l pl-6 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
              <Link href="/admin/login" prefetch={false} className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Admin</span>
              </Link>

              <Link href="/instructor" prefetch={false} className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Instructor</span>
              </Link>

              <Link href="/student" prefetch={false} className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Student</span>
              </Link>
            </div>

            {/* Cart */}
            <div className={`flex items-center space-x-3 border-l pl-6 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
              <Link href="/cart" prefetch={false} className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </div>

            {/* Auth Buttons / Session */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              {loggedIn ? (
                <>
                  <Link
                    href={portalHref}
                    prefetch={false}
                    className={`inline-flex items-center px-4 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                        ? 'text-purple-300 hover:bg-purple-900/50'
                        : 'text-purple-700 hover:bg-purple-50'
                      }`}
                  >
                    {user?.name ? user.name.split(' ')[0] : 'My Portal'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className={`inline-flex items-center px-4 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-purple-900/50'
                        : 'text-gray-700 hover:bg-purple-50'
                      }`}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    prefetch={false}
                    className={`inline-flex items-center px-5 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px] ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                  >
                    Log In
                  </Link>

                  <Link
                    href="/signup"
                    prefetch={false}
                    className="inline-flex items-center px-5 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`xl:hidden inline-flex items-center justify-center p-3 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`xl:hidden border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mt-4`}>
            <div className="py-4 space-y-2">
              <Link href="/" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>
                Home
              </Link>
              <Link href="/courses" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/courses')}>
                Courses
              </Link>
              <Link href="/about" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/about')}>
                About
              </Link>
              <Link href="/contact" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/contact')}>
                Contact
              </Link>

              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-2 pt-2`}>
                <Link href="/admin/login" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}>
                  Admin
                </Link>
                <Link href="/instructor" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}>
                  Instructor
                </Link>
                <Link href="/student" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}>
                  Student
                </Link>
                <Link href="/cart" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}>
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>

              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-2 pt-2`}>
                {loggedIn ? (
                  <>
                    <Link href={portalHref} prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                        ? 'text-purple-300 hover:bg-purple-900/50'
                        : 'text-purple-700 hover:bg-purple-50'
                      }`}>
                      {user?.name ? `${user.name.split(' ')[0]} · Portal` : 'My Portal'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); logout() }}
                      className={`block w-full text-left px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                          ? 'text-gray-300 hover:bg-purple-900/50'
                          : 'text-gray-700 hover:bg-purple-50'
                        }`}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}>
                      Log In
                    </Link>
                    <Link href="/signup" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px]">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
