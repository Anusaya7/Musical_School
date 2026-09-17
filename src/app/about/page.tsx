import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Building2, Landmark, Award } from "lucide-react";
import db from "@/lib/db";

export const metadata = {
  title: "About Us | KORALS DESIGN PVT LTD — Architectural & Engineering Firm Pune",
  description: "Learn about Korals Design Private Limited, an architectural and civil engineering project management firm located in Pune, Maharashtra. Established history since 2005 across industrial, SEZ, corporate and institutional sectors.",
};

export default function AboutPage() {
  const leaders = db.prepare("SELECT * FROM leadership ORDER BY display_order ASC").all() as {
    id: number;
    name: string;
    role: string;
    bio: string;
    image: string;
  }[];

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md">
              COMPANY OVERVIEW &amp; HISTORY
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
              About Korals Design Private Limited
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-normal">
              An architectural services and civil engineering project management provider headquartered in Pune, Maharashtra, India.
            </p>
          </div>
        </div>
      </section>

      {/* History & Positioning */}
      <section className="py-24 bg-[#FFFFFF] border-b border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
                01 / Our Journey &amp; Legacy
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717] mb-6">
                Two Decades of Engineering Excellence
              </h2>
              <div className="space-y-4 text-base text-[#6B6B6B] leading-relaxed">
                <p>
                  <strong>Korals Design Private Limited</strong> is a leading architectural design and statutory approvals consultancy based in Pune, Maharashtra.
                </p>
                <p>
                  Our journey began in <strong>2005</strong> with <em>Pensioners Land Surveyors Associates</em>, focusing on precision ground survey and land revenue demarcation. In <strong>2013</strong>, we expanded our operations into <em>Korals Engineering Solutions Private Limited</em>, broadening our scope across Special Economic Zones (SEZs), heavy industrial manufacturing plants, corporate offices, and municipal institutional developments.
                </p>
                <p>
                  In <strong>2020</strong>, <strong>Korals Design Private Limited</strong> was established to provide an integrated, single-window solution incorporating architectural planning, civil engineering project management, statutory government sanctions (MIDC, MPCB, DISH, PMRDA, PMC, PCMC), and 3D visual walkthroughs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-[#E8E8E5]">
                <div>
                  <h3 className="text-3xl font-bold text-[#171717] font-mono mb-1">2005</h3>
                  <p className="text-xs text-[#6B6B6B]">Land Surveying Roots Established</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#171717] font-mono mb-1">2020</h3>
                  <p className="text-xs text-[#6B6B6B]">Korals Design Pvt Ltd Incorporation</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-2xl">
              <Image
                src="/images/architecture_exterior_1.jpg"
                alt="Korals Design Private Limited Architecture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E8E8E5]">
                <p className="text-xs font-semibold text-[#171717]">Architectural &amp; Engineering Practice</p>
                <p className="text-[11px] text-[#6B6B6B]">Pune • Kasarwadi • Bhosari • Chakan MIDC • PMRDA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise Grid */}
      <section className="py-24 bg-[#F7F7F5] border-b border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              02 / Operational Scope
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717]">
              Comprehensive Industrial &amp; Corporate Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs">
              <Building2 className="w-8 h-8 text-[#171717] mb-6" />
              <h3 className="text-xl font-bold text-[#171717] mb-3">Architectural &amp; Plant Design</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Industrial master planning, process flow architecture, corporate interiors, and 3D visualization tailored for manufacturing plants.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs">
              <Landmark className="w-8 h-8 text-[#171717] mb-6" />
              <h3 className="text-xl font-bold text-[#171717] mb-3">Statutory Government Sanctions</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Technical liaison with government bodies for MIDC, MPCB, DISH, DSLR, PMRDA, PMC, and PCMC building approvals and consents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E8E5] shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#171717] mb-6" />
              <h3 className="text-xl font-bold text-[#171717] mb-3">PMC &amp; Quality Control</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Project management consultancy, site supervision, quantity surveying, third-party inspection, and invoice certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-[#FFFFFF] border-b border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              03 / Leadership &amp; Governance
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717]">
              Board of Directors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-[#F7F7F5] rounded-3xl p-8 border border-[#E8E8E5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#171717] text-white font-bold flex items-center justify-center text-xl shrink-0">
                      {leader.name.charAt(4)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#171717]">{leader.name}</h3>
                      <p className="text-xs font-mono text-[#6B6B6B] uppercase tracking-wider">{leader.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
                    {leader.bio}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8E8E5] flex items-center justify-between text-xs font-semibold text-[#171717]">
                  <span>Korals Design Private Limited</span>
                  <Award className="w-4 h-4 text-[#171717]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People & Culture */}
      <section className="py-24 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
                04 / Workplace Environment
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717] mb-6">
                People &amp; Culture
              </h2>
              <p className="text-base text-[#6B6B6B] leading-relaxed mb-8">
                At Korals Design Private Limited, we prioritize continuous professional growth, transparent employee communication, active team engagement, and a supportive workplace environment that fosters high engineering productivity and technical excellence.
              </p>

              <ul className="space-y-4 text-sm text-[#171717] mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#171717]" />
                  <span>Structured professional development and site training</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#171717]" />
                  <span>Empowered employee voice and collaborative decision-making</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#171717]" />
                  <span>High safety and quality standards across all project sites</span>
                </li>
              </ul>

              <Link
                href="/careers"
                className="inline-flex items-center gap-2.5 text-sm font-semibold bg-[#171717] text-white px-7 py-3.5 rounded-full hover:bg-[#2A2A28] transition-all shadow-md"
              >
                <span>View Career Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#181818] border border-[#E8E8E5] shadow-xl">
              <Image
                src="/images/interior_lounge_1.jpg"
                alt="Korals Design Workplace Environment"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
