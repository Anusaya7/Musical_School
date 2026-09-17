"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Building2,
  Layers,
  Briefcase,
  Mail,
  Plus,
  ArrowRight
} from "lucide-react";

interface Stats {
  totalProjects: number;
  activeServices: number;
  openJobs: number;
  newEnquiries: number;
  totalEnquiries: number;
}

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeServices: 0,
    openJobs: 0,
    newEnquiries: 0,
    totalEnquiries: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((res) => res.json()),
      fetch("/api/enquiries").then((res) => res.json()),
    ])
      .then(([statsData, enquiriesData]) => {
        if (!statsData.error) setStats(statsData);
        if (Array.isArray(enquiriesData)) setRecentEnquiries(enquiriesData.slice(0, 5));
      })
      .catch((err) => console.error("Error fetching admin home data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Top Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Admin CMS Dashboard</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              KORALS DESIGN PVT LTD • Live Database &amp; Content Management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#2A2A28] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {/* Real Stats Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#6B6B6B]">Total Projects</span>
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F5] flex items-center justify-center text-[#171717]">
                <Building2 className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#171717] font-mono">
              {loading ? "..." : stats.totalProjects}
            </div>
            <Link href="/admin/projects" className="text-xs text-[#6B6B6B] hover:text-[#171717] mt-4 flex items-center gap-1">
              <span>Manage Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#6B6B6B]">Active Services</span>
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F5] flex items-center justify-center text-[#171717]">
                <Layers className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#171717] font-mono">
              {loading ? "..." : stats.activeServices}
            </div>
            <Link href="/admin/services" className="text-xs text-[#6B6B6B] hover:text-[#171717] mt-4 flex items-center gap-1">
              <span>Manage Services</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#6B6B6B]">Open Careers</span>
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F5] flex items-center justify-center text-[#171717]">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#171717] font-mono">
              {loading ? "..." : stats.openJobs}
            </div>
            <Link href="/admin/careers" className="text-xs text-[#6B6B6B] hover:text-[#171717] mt-4 flex items-center gap-1">
              <span>Manage Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E5] shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#6B6B6B]">New Enquiries</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Mail className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#171717] font-mono flex items-baseline gap-2">
              <span>{loading ? "..." : stats.newEnquiries}</span>
              <span className="text-xs font-sans text-[#6B6B6B] font-normal">/ {stats.totalEnquiries} total</span>
            </div>
            <Link href="/admin/enquiries" className="text-xs text-[#6B6B6B] hover:text-[#171717] mt-4 flex items-center gap-1">
              <span>View Enquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Contact Enquiries Table */}
        <div className="bg-white rounded-3xl border border-[#E8E8E5] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E8E5]">
            <div>
              <h2 className="text-lg font-bold text-[#171717]">Recent Business Enquiries</h2>
              <p className="text-xs text-[#6B6B6B]">Latest submissions from public contact form</p>
            </div>
            <Link href="/admin/enquiries" className="text-xs font-semibold text-[#171717] hover:underline">
              View All Enquiries →
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#6B6B6B]">No enquiries found in database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E5] text-[#6B6B6B] font-mono uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E5]">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F7F7F5] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold">#{enq.id}</td>
                      <td className="py-3 px-4 font-bold text-[#171717]">{enq.name}</td>
                      <td className="py-3 px-4 text-[#6B6B6B]">{enq.email}</td>
                      <td className="py-3 px-4 text-[#171717]">{enq.subject}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            enq.status === "NEW"
                              ? "bg-amber-100 text-amber-800"
                              : enq.status === "READ"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#6B6B6B]">{enq.created_at ? enq.created_at.substring(0, 10) : "Today"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
