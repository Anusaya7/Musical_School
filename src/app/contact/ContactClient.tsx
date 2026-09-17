"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface SiteSettings {
  company_name: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  career_email: string;
  google_maps_url: string;
}

export default function ContactClient() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    company_name: "KORALS DESIGN PVT LTD",
    address: "201, Laximi Narayan, CTS No. 256B/5, Parvati, Pune, India - 411030",
    phone: "+020 - 24324648",
    mobile: "+91 9822864648",
    email: "projects@koralsdesign.com",
    career_email: "projects@koralsdesign.com",
    google_maps_url: "https://maps.app.goo.gl/CtsjULVzCDCBq1Qk9?g_st=ac",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteSettings) {
          setSiteSettings((prev) => ({
            ...prev,
            ...data.siteSettings,
          }));
        }
      })
      .catch((err) => console.error("Failed to load live site settings:", err));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.enquiryType) {
      newErrors.enquiryType = "Please select an enquiry type.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please enter at least 10 characters in your message.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.enquiryType,
          message: formData.message.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit enquiry. Please try again.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        enquiryType: "",
        message: "",
      });
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (phoneStr: string) => phoneStr.replace(/[^0-9+]/g, "");

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717] selection:bg-[#171717] selection:text-white">
      <Navbar />

      {/* 1. CONTACT PAGE HERO */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden border-b border-[#2A2A28]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CONTACT US
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Let&apos;s Build Something Remarkable
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              Whether you are planning an industrial facility, commercial development, institutional project, architectural design, approvals, surveying or project management, connect with our team.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PREMIUM CONTACT INFORMATION CARDS */}
      <section className="py-16 md:py-24 bg-[#F7F7F5] relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: VISIT US */}
            <div className="bg-white p-7 rounded-3xl border border-[#E8E8E5] shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md group-hover:bg-[#2A2A28] transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-1">
                    OUR HEADQUARTERS
                  </span>
                  <h3 className="text-lg font-bold text-[#171717]">VISIT US</h3>
                </div>
                <div className="text-xs text-[#6B6B6B] leading-relaxed font-normal border-t border-[#F7F7F5] pt-3">
                  <p className="font-semibold text-[#171717] mb-1">{siteSettings.company_name}</p>
                  <p>{siteSettings.address}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#E8E8E5] mt-6">
                <a
                  href={siteSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full bg-[#F7F7F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-[#E8E8E5]"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 2: CALL US */}
            <div className="bg-white p-7 rounded-3xl border border-[#E8E8E5] shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md group-hover:bg-[#2A2A28] transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-1">
                    TELEPHONE DIRECT
                  </span>
                  <h3 className="text-lg font-bold text-[#171717]">CALL US</h3>
                </div>
                <div className="text-xs text-[#6B6B6B] leading-relaxed border-t border-[#F7F7F5] pt-3 space-y-1">
                  <p className="font-mono text-[#171717] font-semibold">Office: {siteSettings.phone}</p>
                  <p className="font-mono text-[#171717] font-semibold">Mobile: {siteSettings.mobile}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#E8E8E5] mt-6 space-y-2">
                <a
                  href={`tel:${cleanPhone(siteSettings.phone)}`}
                  className="w-full py-2 px-3 rounded-full bg-[#F7F7F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 border border-[#E8E8E5]"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Office</span>
                </a>
                <a
                  href={`tel:${cleanPhone(siteSettings.mobile)}`}
                  className="w-full py-2 px-3 rounded-full bg-[#171717] text-white hover:bg-[#2A2A28] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Mobile</span>
                </a>
              </div>
            </div>

            {/* Card 3: WRITE TO US */}
            <div className="bg-white p-7 rounded-3xl border border-[#E8E8E5] shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md group-hover:bg-[#2A2A28] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-1">
                    PROJECT INQUIRIES
                  </span>
                  <h3 className="text-lg font-bold text-[#171717]">WRITE TO US</h3>
                </div>
                <div className="text-xs text-[#6B6B6B] leading-relaxed border-t border-[#F7F7F5] pt-3">
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="font-mono text-[#171717] font-bold text-xs hover:underline block truncate"
                  >
                    {siteSettings.email}
                  </a>
                  <p className="text-[11px] text-[#6B6B6B] mt-1">General &amp; Technical Enquiries</p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#E8E8E5] mt-6">
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#F7F7F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-[#E8E8E5]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Card 4: CAREER INQUIRIES */}
            <div className="bg-white p-7 rounded-3xl border border-[#E8E8E5] shadow-xs hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md group-hover:bg-[#2A2A28] transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-1">
                    JOIN OUR TEAM
                  </span>
                  <h3 className="text-lg font-bold text-[#171717]">CAREER INQUIRIES</h3>
                </div>
                <div className="text-xs text-[#6B6B6B] leading-relaxed border-t border-[#F7F7F5] pt-3">
                  <a
                    href={`mailto:${siteSettings.career_email || siteSettings.email}`}
                    className="font-mono text-[#171717] font-bold text-xs hover:underline block truncate"
                  >
                    {siteSettings.career_email || siteSettings.email}
                  </a>
                  <p className="text-[11px] text-[#6B6B6B] mt-1">Job Applications &amp; Resumes</p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#E8E8E5] mt-6">
                <a
                  href={`mailto:${siteSettings.career_email || siteSettings.email}?subject=${encodeURIComponent("Career Application — Korals Design")}`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#F7F7F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-[#E8E8E5]"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Email Careers</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL VISUAL SECTION & MAIN FORM */}
      <section className="py-16 md:py-24 bg-white border-y border-[#E8E8E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Col: Architectural Visual Card (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E5] min-h-[440px] flex flex-col justify-end p-8 text-white group">
                <Image
                  src="/images/architecture_exterior_1.jpg"
                  alt="Korals Design Architectural Facility"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-mono tracking-widest uppercase backdrop-blur-md border border-white/20">
                    EXCELLENCE IN DESIGN
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                    YOUR PROJECT.<br />OUR EXPERTISE.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                    From architectural planning and engineering to approvals, surveying and project management.
                  </p>

                  <div className="pt-4 border-t border-white/20 space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-white/90">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Statutory Approvals: MIDC, MPCB, DISH, PMRDA</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Precision Surveying &amp; Government Mojani</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Turnkey Industrial &amp; Corporate PMC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#F7F7F5] p-8 md:p-12 rounded-3xl border border-[#E8E8E5] shadow-xs">
              <div className="mb-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-2">
                  DIRECT ENQUIRY
                </span>
                <h2 className="text-3xl font-bold text-[#171717] tracking-tight mb-2">
                  SEND US AN ENQUIRY
                </h2>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Have a project in mind? Tell us about it and our team will get in touch.
                </p>
              </div>

              {success ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-4 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-emerald-950">Enquiry Submitted Successfully</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    Thank you for contacting Koral&apos;s Design. Your enquiry has been received successfully. Our team will get in touch with you.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-all shadow-xs"
                  >
                    <span>Send Another Message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {serverError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-[#171717] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mahesh Patil"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none transition-all ${
                          errors.name
                            ? "border-rose-500 bg-rose-50/20"
                            : "border-[#E8E8E5] focus:border-[#171717]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-[#171717] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. patil@industrialcorp.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none transition-all ${
                          errors.email
                            ? "border-rose-500 bg-rose-50/20"
                            : "border-[#E8E8E5] focus:border-[#171717]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-[#171717] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 9822864648"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-[#E8E8E5] rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    {/* Enquiry Type */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-[#171717] mb-2">
                        Enquiry Type *
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => {
                          setFormData({ ...formData, enquiryType: e.target.value });
                          if (errors.enquiryType) setErrors({ ...errors, enquiryType: "" });
                        }}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none transition-all ${
                          errors.enquiryType
                            ? "border-rose-500 bg-rose-50/20"
                            : "border-[#E8E8E5] focus:border-[#171717]"
                        }`}
                      >
                        <option value="">Select Enquiry Type...</option>
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Architectural Services">Architectural Services</option>
                        <option value="Engineering Services">Engineering Services</option>
                        <option value="Project Management">Project Management</option>
                        <option value="Land Survey & Consultancy">Land Survey &amp; Consultancy</option>
                        <option value="Sanctions & Approvals">Sanctions &amp; Approvals</option>
                        <option value="Project Works Consultancy">Project Works Consultancy</option>
                        <option value="Career Inquiry">Career Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.enquiryType && (
                        <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.enquiryType}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-[#171717] mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please describe your facility requirements, site area, required statutory clearances, or project timeline..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: "" });
                      }}
                      className={`w-full bg-white border rounded-xl p-4 text-xs text-[#171717] focus:outline-none transition-all ${
                        errors.message
                          ? "border-rose-500 bg-rose-50/20"
                          : "border-[#E8E8E5] focus:border-[#171717]"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-[#171717] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#2A2A28] transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Enquiry...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        <span>SEND ENQUIRY</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4. GOOGLE MAP / LOCATION PREVIEW SECTION */}
      <section className="py-20 md:py-28 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block mb-2">
              PUNE HEADQUARTERS
            </span>
            <h2 className="text-3xl font-bold text-[#171717] tracking-tight mb-3">
              FIND US
            </h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Korals Design Private Limited — Parvati, Pune
            </p>
          </div>

          {/* Polished Location Card & Map Preview */}
          <div className="bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
            
            {/* Map Info Box */}
            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-[#181818] text-white space-y-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider mb-6 border border-white/20">
                  REGISTERED OFFICE
                </span>
                <h3 className="text-2xl font-bold mb-4">{siteSettings.company_name}</h3>
                <div className="text-xs text-white/80 leading-relaxed space-y-2 font-normal">
                  <p className="font-semibold text-white">{siteSettings.address}</p>
                  <p className="pt-2 text-white/70">Phone: {siteSettings.phone}</p>
                  <p className="text-white/70">Mobile: {siteSettings.mobile}</p>
                  <p className="text-white/70">Email: {siteSettings.email}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/15">
                <a
                  href={siteSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-white text-[#171717] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all duration-200 shadow-md group"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Map Visual Graphic Placeholder / Embed Container */}
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[440px] bg-[#E8E8E5] flex items-center justify-center overflow-hidden group">
              <Image
                src="/images/hero_villa_render.jpg"
                alt="Korals Design Pune Location"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              <div className="relative z-10 text-center p-8 max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-base mb-1">Parvati, Pune Headquarters</h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    201, Laximi Narayan, CTS No. 256B/5, Parvati, Pune - 411030
                  </p>
                </div>
                <a
                  href={siteSettings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#171717] hover:underline pt-2"
                >
                  <span>View exact location on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. QUICK CONTACT CTA */}
      <section className="py-20 bg-[#181818] text-white border-t border-[#2A2A28]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-white/70 block">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              READY TO DISCUSS YOUR PROJECT?
            </h2>
            <p className="text-base text-white/80 leading-relaxed font-normal">
              Let&apos;s connect and explore how we can help.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`tel:${cleanPhone(siteSettings.phone)}`}
                className="px-6 py-3.5 rounded-full bg-white text-[#171717] font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us</span>
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="px-6 py-3.5 rounded-full bg-[#2A2A28] text-white font-semibold text-xs border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2 shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>
              <a
                href={siteSettings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-transparent text-white font-semibold text-xs border border-white/30 hover:border-white transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
