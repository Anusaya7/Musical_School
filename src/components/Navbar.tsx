"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-backdrop-scrolled py-3 border-b border-[#E8E8E5]"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="KORALS DESIGN PVT LTD Homepage">
          <div className="relative h-11 sm:h-12 w-[220px] sm:w-[265px]">
            <Image
              src={scrolled ? "/images/logo/korals_logo.svg" : "/images/logo/korals_logo_white.svg"}
              alt="KORALS DESIGN PVT LTD Logo"
              fill
              className="object-contain object-left transition-opacity duration-300"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Projects", href: "/projects" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[14px] font-medium transition-colors ${
                scrolled
                  ? "text-[#171717]/80 hover:text-[#171717]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/contact"
            className={`inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-2.2 rounded-full transition-all hover:shadow-md active:scale-95 ${
              scrolled
                ? "bg-[#171717] text-white hover:bg-[#2A2A28]"
                : "bg-white text-[#171717] hover:bg-[#F0F0ED]"
            }`}
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            scrolled
              ? "text-[#171717] hover:bg-[#E8E8E5]/50"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#F7F7F5] border-b border-[#E8E8E5] px-6 py-6 shadow-xl animate-fade-in z-50">
          <div className="flex flex-col gap-3">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Our Services", href: "/services" },
              { label: "Projects Portfolio", href: "/projects" },
              { label: "Careers", href: "/careers" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] font-medium text-[#171717] py-2 border-b border-[#E8E8E5]/60"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-[15px] font-medium bg-[#171717] text-white rounded-full flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Request Project Proposal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}



