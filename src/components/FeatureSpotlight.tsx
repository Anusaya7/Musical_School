"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FeatureSpotlight() {
  return (
    <section className="py-24 md:py-32 bg-[#F7F7F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-28 md:space-y-36">
        
        {/* Feature 1: IMAGE LEFT, TEXT RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Left */}
          <div className="relative aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-2xl group">
            <Image
              src="/images/architecture_exterior_1.jpg"
              alt="Explore Ideas Without Limits"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-[#171717] border border-[#E8E8E5] shadow-xs">
              Material Study • Board-Formed Concrete & Timber
            </div>
          </div>

          {/* Text Right */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              05 / Creative Autonomy
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-6 leading-tight">
              Explore Ideas Without Limits
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-8">
              Experiment with materials, lighting, environments, styles, and visual directions without rebuilding your entire workflow.
            </p>

            <ul className="space-y-3.5 mb-10 text-sm text-[#171717]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Real-time material swap with surface bump-map preservation</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Infinite sun position, cloud density, and dusk lighting variations</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Export presentation decks directly to client review portals</span>
              </li>
            </ul>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 text-sm font-semibold bg-[#171717] text-white px-7 py-3.5 rounded-full hover:bg-[#2A2A28] transition-all shadow-md active:scale-98"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature 2: TEXT LEFT, IMAGE RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Left */}
          <div className="order-2 lg:order-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              06 / Client Ready Output
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-6 leading-tight">
              Move From Rough Concept to Presentation Ready
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-8">
              Bridge the gap between raw early design proposals and high-stakes client presentations in record time. Impress partners with photorealistic spatial accuracy from your very first kickoff meeting.
            </p>

            <ul className="space-y-3.5 mb-10 text-sm text-[#171717]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Instant 8K export for architectural print portfolios</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Maintain 100% geometric fidelity to vector CAD drawings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#171717] shrink-0" />
                <span>Seamless integration with Figma, Revit, and Rhino workflows</span>
              </li>
            </ul>

            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 text-sm font-semibold bg-[#FFFFFF] text-[#171717] border border-[#E8E8E5] px-7 py-3.5 rounded-full hover:bg-[#E8E8E5]/50 transition-all shadow-xs"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image Right */}
          <div className="order-1 lg:order-2 relative aspect-[4/3] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-2xl group">
            <Image
              src="/images/interior_lounge_1.jpg"
              alt="Move From Rough Concept to Presentation Ready"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-[#171717] border border-[#E8E8E5] shadow-xs">
              Spatial Interior • Wabi-Sabi Living Lounge
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

