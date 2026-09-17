import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
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
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

interface ServiceRecord {
  id: number;
  service_number: string;
  title: string;
  slug: string;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let service: ServiceRecord | undefined;
  if (/^\d+$/.test(slug)) {
    service = db.prepare("SELECT * FROM services WHERE id = ?").get(slug) as ServiceRecord | undefined;
  } else {
    service = db.prepare("SELECT * FROM services WHERE slug = ?").get(slug) as ServiceRecord | undefined;
  }

  if (!service) {
    return { title: "Service Not Found | Korals Design Pvt Ltd" };
  }

  return {
    title: `${service.title} | Korals Design Pvt Ltd`,
    description: service.short_description,
    openGraph: {
      title: `${service.title} | Korals Design Pvt Ltd`,
      description: service.short_description,
      url: `https://www.koralsdesign.com/services/${service.slug || service.id}`,
      siteName: "KORALS DESIGN PVT LTD",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: ServiceRecord | undefined;
  if (/^\d+$/.test(slug)) {
    service = db.prepare("SELECT * FROM services WHERE id = ?").get(slug) as ServiceRecord | undefined;
  } else {
    service = db.prepare("SELECT * FROM services WHERE slug = ?").get(slug) as ServiceRecord | undefined;
  }

  if (!service || !service.is_published) {
    notFound();
  }

  const bullets = service.bullet_points ? service.bullet_points.split(",") : [];
  const IconComp = ICON_MAP[service.icon] || Compass;

  // Related services
  const otherServices = db
    .prepare("SELECT * FROM services WHERE id != ? AND is_published = 1 ORDER BY display_order ASC LIMIT 3")
    .all(service.id) as ServiceRecord[];

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717] selection:bg-[#171717] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden border-b border-[#2A2A28]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase backdrop-blur-md">
                SERVICE {service.service_number}
              </span>
              <span className="text-xs font-mono text-white/60 uppercase">KORALS DESIGN PRACTICE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              {service.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-white text-[#171717] font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
              >
                <span>CONSULT ON {service.title.toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/services"
                className="px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <span>ALL SERVICES</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Main Content */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Col (7 cols): Full Description & Capabilities */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B]">
                    SERVICE SCOPE &amp; CAPABILITIES
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-[#171717] tracking-tight mb-6">
                  Practice Overview
                </h2>

                <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed whitespace-pre-line font-normal">
                  {service.full_description}
                </p>
              </div>

              {/* Capabilities */}
              {bullets.length > 0 && (
                <div className="bg-[#F7F7F5] p-8 rounded-3xl border border-[#E8E8E5] space-y-6">
                  <h3 className="text-xl font-bold text-[#171717]">
                    Key Deliverables &amp; Core Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-[#171717]">
                    {bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#E8E8E5]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{bullet.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Process Workflow */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#171717]">
                  Delivery Process &amp; Methodology
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E8E5] bg-[#F7F7F5]">
                    <span className="w-8 h-8 rounded-full bg-[#171717] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      01
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">Requirement Consultation &amp; Scope Assessment</h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">Analyzing client operational needs, site parameters, and regulatory requirements.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E8E5] bg-[#F7F7F5]">
                    <span className="w-8 h-8 rounded-full bg-[#171717] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">Land Survey &amp; Technical Documentation</h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">Ground truth mapping, CAD drafting, structural calculations, and compliance verification.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E8E5] bg-[#F7F7F5]">
                    <span className="w-8 h-8 rounded-full bg-[#171717] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      03
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">Statutory Department Liaison &amp; Approvals</h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">Technical submission and follow-up with MIDC, MPCB, DISH, PMRDA, PMC, or PCMC.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E8E5] bg-[#F7F7F5]">
                    <span className="w-8 h-8 rounded-full bg-[#171717] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      04
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">Construction PMC &amp; Quality Supervision</h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">On-site execution monitoring, invoice verification, and technical audits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col (5 cols): Visual Image & Quick Contact Box */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-36">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-2xl group">
                <Image
                  src={service.image || "/images/architecture_exterior_1.jpg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-mono">
                  KORALS DESIGN PVT LTD • PUNE
                </div>
              </div>

              <div className="bg-[#181818] text-white p-8 rounded-3xl space-y-6 shadow-xl border border-[#2A2A28]">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                    PRACTICE CONSULTATION
                  </span>
                  <h3 className="text-2xl font-bold">Have a Project Request?</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-normal">
                    Connect directly with our engineering and architectural directors for customized project proposals.
                  </p>
                </div>

                <div className="pt-4 border-white/15 space-y-3">
                  <Link
                    href="/contact"
                    className="w-full py-3.5 px-6 rounded-full bg-white text-[#171717] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-md"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="tel:+02024324648"
                    className="w-full py-3 px-6 rounded-full bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20"
                  >
                    <span>Call Office: +020 - 24324648</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Services */}
      {otherServices.length > 0 && (
        <section className="py-20 bg-[#F7F7F5] border-t border-[#E8E8E5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-1">
                  ADDITIONAL PRACTICE AREAS
                </span>
                <h2 className="text-2xl font-bold text-[#171717]">Explore Related Services</h2>
              </div>
              <Link href="/services" className="text-xs font-bold text-[#171717] hover:underline flex items-center gap-1">
                <span>View All Services</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <div key={s.id} className="bg-white rounded-3xl p-6 border border-[#E8E8E5] space-y-4 hover:shadow-lg transition-all">
                  <span className="text-[10px] font-mono text-[#6B6B6B] uppercase">PRACTICE {s.service_number}</span>
                  <h3 className="text-base font-bold text-[#171717]">{s.title}</h3>
                  <p className="text-xs text-[#6B6B6B] line-clamp-2">{s.short_description}</p>
                  <Link
                    href={`/services/${s.slug || s.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#171717] hover:underline pt-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
