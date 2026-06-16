'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react';
import Image from "next/image";
import logo from "@/public/images/logo3.png"; // Update with your logo path

export default function Header() {
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? theme === 'dark' 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-white/95 backdrop-blur-md shadow-lg'
        : theme === 'dark'
          ? 'bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700'
          : 'bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm'
    }`}>
     <div className="container mx-auto px-4 h-full">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          {/* <Link
            href="/"
            className={`flex flex-col leading-tight font-bold shrink-0 ${
              theme === 'dark' ? 'text-white' : 'text-primary'
            }`}
          >
            <span className="text-base sm:text-lg lg:text-xl whitespace-nowrap">
              2nd Inversion
            </span>
            <span className="text-[10px] sm:text-xs lg:text-sm opacity-80 whitespace-nowrap">
              Musical School
            </span>
          </Link> */}

           <div className="w-[250px] flex items-center">
            <Link href="/">
              <Image
                src={logo}
                alt="2nd Inversion Music School"
                priority
                width={250}
                height={60}
                className="object-contain w-full h-auto"
              />
            </Link>
          </div>

          {/* Nav */}
          <nav className="hidden xl:flex items-center gap-3 flex-nowrap">
            {/* Main Navigation Links */}
            <div className="flex gap-1">
              <Link href="/" className={`inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Home
              </Link>
              <Link href="/courses" className={`inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Courses
              </Link>
              <Link href="/about" className={`inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                About
              </Link>
              <Link href="/contact" className={`inline-flex items-center px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Contact
              </Link>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center space-x-4 border-l border-gray-300 pl-6">
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
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
            <div className={`flex items-center space-x-4 border-l pl-6 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <Link href="/admin" className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Admin</span>
              </Link>
              
              <Link href="/instructor" className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Instructor</span>
              </Link>
              
              <Link href="/student" className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
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
            <div className={`flex items-center space-x-3 border-l pl-6 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <Link href="/cart" className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
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
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <Link
                  href="/login"
                  className={`inline-flex items-center px-5 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px] ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center px-5 py-2 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px]"
                >
                  Sign Up
                </Link>
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden inline-flex items-center justify-center p-3 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
              theme === 'dark' 
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
          <div className={`lg:hidden border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mt-4`}>
            <div className="py-4 space-y-2">
              <Link href="/" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Home
              </Link>
              <Link href="/courses" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Courses
              </Link>
              <Link href="/about" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                About
              </Link>
              <Link href="/contact" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}>
                Contact
              </Link>
              
              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-2 pt-2`}>
                <Link href="/admin" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                  Admin
                </Link>
                <Link href="/instructor" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                  Instructor
                </Link>
                <Link href="/student" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                  Student
                </Link>
                <Link href="/cart" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>
              
              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-2 pt-2`}>
                <Link href="/login" className={`block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-h-[44px] ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}>
                  Log In
                </Link>
                <Link href="/signup" className="block px-3 py-2 font-medium rounded-xl transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px]">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
