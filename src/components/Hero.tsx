"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Play, Pause } from "lucide-react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check mobile breakpoint
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check prefers-reduced-motion safely inside effect
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setTimeout(() => {
        setReducedMotion(true);
        setIsPlaying(false);
      }, 0);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section id="product" className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#181818] text-white">
      {/* 1. Full-Screen HTML5 Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero_villa_render.jpg"
          key={isMobile ? "mobile-video" : "desktop-video"}
          className="w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-1000"
        >
          <source
            src={isMobile ? "/videos/hero_bg_mobile.mp4" : "/videos/hero_bg.mp4"}
            type="video/mp4"
          />
          {/* Fallback poster image if video unsupported */}
          <Image
            src="/images/hero_villa_render.jpg"
            alt="KORALS DESIGN Hero Background Visualization"
            fill
            className="object-cover"
          />
        </video>
      </div>

      {/* 2. Premium Subtle Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#181818]/90 z-[1] pointer-events-none" />

      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:32px_32px] z-[1]" />

      {/* 3. Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-mono tracking-wider uppercase mb-8 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>QUALITY YOU CAN TRUST</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white tracking-[-0.035em] leading-[1.04] max-w-5xl mb-6 drop-shadow-md">
          Innovating Industrial &amp; <br className="hidden sm:inline" />
          <span className="text-white/80 font-normal italic font-serif">Architectural</span> Spaces.
        </h1>

        {/* Supporting Copy */}
        <p className="text-lg md:text-xl text-white/80 max-w-2xl font-normal leading-relaxed mb-10 drop-shadow-sm">
          End-to-End Solutions — Design, Approvals and Execution.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base font-semibold bg-white text-[#171717] px-8 py-4 rounded-full hover:bg-[#F0F0ED] transition-all shadow-xl hover:shadow-2xl active:scale-98"
          >
            <Sparkles className="w-4.5 h-4.5 text-[#171717]" />
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white/20 hover:border-white/30 transition-all shadow-md"
          >
            <span>Our Services</span>
          </Link>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center justify-center gap-6 md:gap-12 py-3.5 px-6 md:px-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-xs md:text-sm text-white/90 shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Architectural Planning</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Statutory Clearances</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Project Management</span>
          </div>
        </div>

        {/* Floating Video Pause/Play Control Badge */}
        <div className="absolute bottom-4 right-6 md:bottom-6 md:right-12 z-20">
          <button
            onClick={togglePlay}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white/80 hover:text-white text-xs font-mono transition-all"
            aria-label={isPlaying ? "Pause Hero Background Video" : "Play Hero Background Video"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? "Pause Video" : "Play Video"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
