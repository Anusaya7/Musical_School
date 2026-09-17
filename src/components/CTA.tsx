"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-28 md:py-36 bg-[#181818] text-white overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Decorative Architectural Render Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden lg:block overflow-hidden">
        <Image
          src="/images/architecture_exterior_1.jpg"
          alt="FORMA AI Render Background"
          fill
          className="object-cover mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181818] via-[#181818]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Generative AI Visualization</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Bring Your Next Idea <br className="hidden sm:inline" />
            to Life.
          </h2>

          <p className="text-lg text-white/70 font-normal leading-relaxed mb-10 max-w-xl">
            Create, explore, and refine your ideas with AI-powered visualization.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base font-medium bg-white text-[#171717] px-8 py-4 rounded-full hover:bg-[#F0F0ED] transition-all shadow-xl active:scale-98"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-medium bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

