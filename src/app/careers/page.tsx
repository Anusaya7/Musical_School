import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Mail, CheckCircle2 } from "lucide-react";
import db from "@/lib/db";

export const metadata = {
  title: "Careers | KORALS DESIGN PVT LTD — Open Job Positions Pune",
  description: "Explore career opportunities at Korals Design Private Limited in Pune, Maharashtra. Apply for Construction Safety Manager, Health and Safety Coordinator, and architectural engineering positions.",
};

export default function CareersPage() {
  const careers = db.prepare("SELECT * FROM careers WHERE is_published = 1 ORDER BY display_order ASC").all() as {
    id: number;
    title: string;
    location: string;
    employment_type: string;
    description: string;
    requirements: string;
    application_email: string;
  }[];

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md">
              JOIN OUR ENGINEERING TEAM
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Careers at Korals Design
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-normal">
              Build your career with an established architectural planning and civil project management practice in Pune.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions List */}
      <section className="py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              01 / Current Opportunities
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717]">
              Open Job Positions
            </h2>
          </div>

          <div className="space-y-8">
            {careers.map((job) => {
              const reqs = job.requirements ? job.requirements.split(";") : [];
              return (
                <div
                  key={job.id}
                  className="bg-[#F7F7F5] rounded-3xl p-8 border border-[#E8E8E5] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-[#D4D4CE] transition-all shadow-xs"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="bg-[#171717] text-white px-3 py-1 rounded-full text-xs font-mono font-semibold">
                        {job.employment_type}
                      </span>
                      <span className="text-xs font-mono text-[#6B6B6B] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#171717]" />
                        {job.location}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#171717] mb-3">{job.title}</h3>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">{job.description}</p>

                    {reqs.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-semibold text-[#171717] uppercase block mb-1">Requirements:</span>
                        <ul className="space-y-1.5 text-xs text-[#6B6B6B]">
                          {reqs.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#171717] shrink-0 mt-0.5" />
                              <span>{r.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-start md:items-end gap-3 pt-6 md:pt-0 border-t md:border-t-0 border-[#E8E8E5]">
                    <a
                      href={`mailto:${job.application_email}?subject=Application for ${encodeURIComponent(job.title)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold bg-[#171717] text-white px-7 py-3.5 rounded-full hover:bg-[#2A2A28] transition-all shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Apply Now</span>
                    </a>
                    <span className="text-[11px] font-mono text-[#6B6B6B]">
                      Send CV to {job.application_email}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section className="py-20 bg-[#F7F7F5] border-t border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-[#171717] mb-4">Don&apos;t See Your Role Listed?</h2>
          <p className="text-sm text-[#6B6B6B] mb-8 leading-relaxed">
            We are always interested in meeting skilled architects, land surveyors, and civil project managers in Pune.
          </p>

          <a
            href="mailto:projects@koralsdesign.com?subject=General Career Application — Korals Design"
            className="inline-flex items-center gap-2.5 text-sm font-semibold bg-white text-[#171717] border border-[#E8E8E5] px-8 py-3.5 rounded-full hover:bg-[#E8E8E5]/50 transition-all shadow-xs"
          >
            <Mail className="w-4 h-4 text-[#171717]" />
            <span>Submit Spontaneous Resume</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
