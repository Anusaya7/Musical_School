"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Layers,
  ShieldCheck,
  MapPin,
  FileText,
  Factory,
  Layout,
  Eye,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck,
  ChevronRight,
} from "lucide-react";

interface ServiceItem {
  id: number;
  service_number: string;
  title: string;
  slug?: string;
  short_description: string;
  full_description: string;
  bullet_points: string;
  image: string;
  icon: string;
  cta_label?: string;
  cta_link?: string;
  display_order: number;
  is_published: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Layers,
  ShieldCheck,
  MapPin,
  FileText,
  Factory,
  Layout,
  Eye,
};

export default function ServicesClient() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Failed to load services:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717] selection:bg-[#171717] selection:text-white">
      <Navbar />

      {/* 1. SERVICES HERO */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden border-b border-[#2A2A28]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OUR SERVICES
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              Integrated Design, Engineering &amp; Project Solutions
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              Korals Design Pvt Ltd specializes in architectural design, civil engineering project management, and expertise in navigating government procedures and systems, including technical liaison with various government departments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#services-grid"
                className="px-7 py-3.5 rounded-full bg-white text-[#171717] font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <span>CONTACT US</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN PROFESSIONAL SERVICES GRID */}
      <section id="services-grid" className="py-20 md:py-28 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-2">
              KORALS DESIGN PRACTICE AREAS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight mb-4">
              PROFESSIONAL SERVICES
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
              Comprehensive solutions from planning and design to approvals, execution and project management.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-[#E8E8E5]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((item) => {
                const IconComp = ICON_MAP[item.icon] || Compass;
                const bullets = item.bullet_points ? item.bullet_points.split(",") : [];
                const slugRoute = item.slug ? `/services/${item.slug}` : `/services/${item.id}`;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-8 border border-[#E8E8E5] shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-6">
                      {/* Card Header: Number & Icon */}
                      <div className="flex items-center justify-between border-b border-[#F7F7F5] pb-4">
                        <span className="text-xs font-mono font-bold text-[#6B6B6B]">
                          SERVICE {item.service_number}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md group-hover:bg-[#2A2A28] transition-colors">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Title & Short Description */}
                      <div>
                        <h3 className="text-xl font-bold text-[#171717] mb-2 group-hover:text-black transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed font-normal">
                          {item.short_description}
                        </p>
                      </div>

                      {/* Capabilities Bullet Points */}
                      {bullets.length > 0 && (
                        <div className="pt-2 border-t border-[#F7F7F5] space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B] block mb-1">
                            Key Capabilities:
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#171717]">
                            {bullets.slice(0, 4).map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{b.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Action CTA */}
                    <div className="pt-6 border-t border-[#E8E8E5] mt-6">
                      <Link
                        href={slugRoute}
                        className="w-full py-3 px-4 rounded-full bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white text-[#171717] text-xs font-semibold flex items-center justify-between transition-all duration-200 border border-[#E8E8E5]"
                      >
                        <span>{item.cta_label || "LEARN MORE"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURED SERVICE HIGHLIGHT SPOTLIGHT */}
      <section className="py-20 md:py-28 bg-white border-y border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-2xl group">
              <Image
                src="/images/hero_villa_render.jpg"
                alt="Korals Design Concept to Completion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.8]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-mono tracking-widest uppercase backdrop-blur-md border border-white/20">
                  TURNKEY DELIVERY
                </span>
                <h4 className="text-xl font-bold">Industrial &amp; Architectural Excellence</h4>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
                INTEGRATED SERVICE FRAMEWORK
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight leading-tight">
                FROM CONCEPT TO COMPLETION
              </h2>
              <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed font-normal">
                Integrated expertise across architectural design, engineering, project management, government procedures, technical coordination and project consultancy.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-[#171717]">
                  <Building2 className="w-5 h-5 text-[#171717] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Architectural &amp; Industrial Master Planning</h4>
                    <p className="text-[#6B6B6B]">Comprehensive facility design, process flow integration, and structural CAD modeling.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-[#171717]">
                  <FileCheck className="w-5 h-5 text-[#171717] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Statutory Government Clearances</h4>
                    <p className="text-[#6B6B6B]">Liaison and technical approval coordination with MPCB, MIDC, DISH, PMRDA, PMC, PCMC.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-[#171717]">
                  <Layers className="w-5 h-5 text-[#171717] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Execution Monitoring &amp; PMC</h4>
                    <p className="text-[#6B6B6B]">On-site supervision, quantity estimation, invoice verification, and handover dossiers.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#171717] text-white font-semibold text-xs hover:bg-[#2A2A28] transition-all shadow-md"
                >
                  <span>DISCUSS YOUR PROJECT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. GOVERNMENT PROCEDURES & TECHNICAL LIAISON SECTION */}
      <section className="py-20 md:py-28 bg-[#181818] text-white border-b border-[#2A2A28]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase backdrop-blur-md">
              TECHNICAL LIAISON &amp; COMPLIANCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              GOVERNMENT PROCEDURES &amp; TECHNICAL LIAISON
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Korals Design Pvt Ltd brings expertise in navigating government procedures and systems, with technical liaison and coordination support involving various government departments and authorities.
            </p>
          </div>

          {/* 5 Visual Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-[#262624] p-6 rounded-3xl border border-white/10 space-y-4 relative group">
              <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors">
                01
              </span>
              <h3 className="font-bold text-sm text-white">DOCUMENTATION</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Technical file preparation, building drawings, and statutory checklist compilation.
              </p>
            </div>

            <div className="bg-[#262624] p-6 rounded-3xl border border-white/10 space-y-4 relative group">
              <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors">
                02
              </span>
              <h3 className="font-bold text-sm text-white">SUBMISSION &amp; COORDINATION</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Formal portal submission and technical filing across statutory department desks.
              </p>
            </div>

            <div className="bg-[#262624] p-6 rounded-3xl border border-white/10 space-y-4 relative group">
              <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors">
                03
              </span>
              <h3 className="font-bold text-sm text-white">TECHNICAL FOLLOW-UP</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Active liaison, technical queries clarification, and site inspection coordination.
              </p>
            </div>

            <div className="bg-[#262624] p-6 rounded-3xl border border-white/10 space-y-4 relative group">
              <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors">
                04
              </span>
              <h3 className="font-bold text-sm text-white">APPROVAL PROCESS SUPPORT</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Assisting statutory compliance evaluation for building approvals and consents.
              </p>
            </div>

            <div className="bg-[#262624] p-6 rounded-3xl border border-white/10 space-y-4 relative group">
              <span className="text-2xl font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors">
                05
              </span>
              <h3 className="font-bold text-sm text-white">PROJECT PROGRESSION</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Clearance certification handover ensuring uninterrupted construction execution.
              </p>
            </div>

          </div>

          <div className="mt-12 text-xs text-white/60 font-mono text-center border-t border-white/10 pt-6">
            Liaison coordination support for MIDC, MPCB, DISH, PMRDA, PMC, PCMC, DSLR / SLR statutory frameworks.
          </div>
        </div>
      </section>

      {/* 5. WHY KORALS DESIGN SECTION */}
      <section className="py-20 md:py-28 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-2">
              VALUE PROPOSITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight mb-3">
              WHY KORALS DESIGN
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
              Factual, service-oriented engineering excellence across Maharashtra
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#171717]">Integrated Expertise</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Architectural, civil engineering, land surveying, consultancy and project-management capabilities under one roof.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#171717]">Technical Coordination</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Dedicated support for technical coordination with relevant statutory authorities and government departments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#171717]">End-to-End Support</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Complete lifecycle support from initial site survey and architectural planning through execution and handover.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-[#171717]">Industry-Focused Approach</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Tailored architectural and engineering solutions designed specifically around industrial and corporate operational requirements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PROJECT CONNECTION SHOWCASE */}
      <section className="py-20 bg-white border-t border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-2">
                PRACTICE PROOF POINTS
              </span>
              <h2 className="text-3xl font-bold text-[#171717] tracking-tight">
                PROVEN PRACTICE PORTFOLIO
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:underline"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F7F5] rounded-3xl p-6 border border-[#E8E8E5] space-y-3">
              <span className="text-[10px] font-mono text-[#6B6B6B] uppercase">ALFA LAVAL INDIA LTD</span>
              <h3 className="text-lg font-bold text-[#171717]">Industrial Facility Pune</h3>
              <p className="text-xs text-[#6B6B6B]">Architectural design, structural PMC, and statutory MIDC sanctions (12,274 Sq.M.).</p>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] pt-2">
                <span>View Project Case Study</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#F7F7F5] rounded-3xl p-6 border border-[#E8E8E5] space-y-3">
              <span className="text-[10px] font-mono text-[#6B6B6B] uppercase">SHRIRAMPUR MUNICIPAL CORP</span>
              <h3 className="text-lg font-bold text-[#171717]">Municipal Infrastructure</h3>
              <p className="text-xs text-[#6B6B6B]">Land survey, contour mapping, government Mojani, and civil master planning.</p>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] pt-2">
                <span>View Project Case Study</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#F7F7F5] rounded-3xl p-6 border border-[#E8E8E5] space-y-3">
              <span className="text-[10px] font-mono text-[#6B6B6B] uppercase">SUZLON ENERGY FACILITY</span>
              <h3 className="text-lg font-bold text-[#171717]">Green Energy Campus</h3>
              <p className="text-xs text-[#6B6B6B]">Industrial process flow design, survey consultancy, and statutory clearances.</p>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] pt-2">
                <span>View Project Case Study</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA */}
      <section className="py-20 bg-[#181818] text-white border-t border-[#2A2A28]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-white/70 block">
              START A CONSULTATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              HAVE A PROJECT IN MIND?
            </h2>
            <p className="text-base text-white/80 leading-relaxed font-normal">
              Let&apos;s discuss your architectural, engineering or project requirements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-white text-[#171717] font-semibold text-xs hover:bg-white/90 transition-all shadow-md flex items-center gap-2"
              >
                <span>CONTACT US</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <span>GET IN TOUCH</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
