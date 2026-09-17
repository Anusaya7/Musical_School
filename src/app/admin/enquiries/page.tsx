"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Mail, Trash2, Eye, X, Phone, User, Search } from "lucide-react";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEnquiries = () => {
    fetch("/api/enquiries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEnquiries(data);
      });
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
      loadEnquiries();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this enquiry record?")) return;
    const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      loadEnquiries();
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "ALL" ? true : e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Contact Enquiries Database</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              View, track, filter, and manage public contact form enquiries submitted to Korals Design Private Limited
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "NEW", "READ", "IN PROGRESS", "REPLIED", "CLOSED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-[#171717] text-white shadow-xs"
                    : "bg-white text-[#171717] border border-[#E8E8E5]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Counter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E8E5] rounded-full pl-10 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>
          <span className="text-xs text-[#6B6B6B] font-mono">
            Showing {filteredEnquiries.length} of {enquiries.length} total enquiries
          </span>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] bg-[#F7F7F5] text-[#6B6B6B] font-mono uppercase">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Enquiry Type / Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#6B6B6B]">
                      No contact enquiries found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((e) => (
                    <tr
                      key={e.id}
                      className={`hover:bg-[#F7F7F5]/60 transition-colors ${
                        e.status === "NEW" ? "bg-amber-50/40 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono">#{e.id}</td>
                      <td className="py-3.5 px-4 text-[#171717]">{e.name}</td>
                      <td className="py-3.5 px-4 text-[#6B6B6B] font-mono">{e.email}</td>
                      <td className="py-3.5 px-4 font-mono text-[#6B6B6B]">{e.phone || "N/A"}</td>
                      <td className="py-3.5 px-4 text-[#171717] max-w-xs truncate">{e.subject}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={e.status}
                          onChange={(evt) => updateStatus(e.id, evt.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border focus:outline-none ${
                            e.status === "NEW"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : e.status === "READ"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : e.status === "REPLIED"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-[#F7F7F5] text-[#171717] border-[#E8E8E5]"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="READ">READ</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="REPLIED">REPLIED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#6B6B6B]">
                        {e.created_at ? e.created_at.substring(0, 10) : "Today"}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            if (e.status === "NEW") updateStatus(e.id, "READ");
                            setSelectedEnquiry(e);
                          }}
                          className="p-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#E8E8E5] text-[#171717] transition-colors"
                          title="View Enquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E5] shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-6 right-6 p-1 text-[#6B6B6B] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#6B6B6B] uppercase">ENQUIRY RECORD #{selectedEnquiry.id}</span>
                <h2 className="text-xl font-bold text-[#171717]">{selectedEnquiry.subject}</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                {selectedEnquiry.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#6B6B6B]" />
                <span className="font-bold text-[#171717]">{selectedEnquiry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6B6B6B]" />
                <a href={`mailto:${selectedEnquiry.email}`} className="font-mono text-indigo-600 hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              {selectedEnquiry.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#6B6B6B]" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-mono text-[#171717] hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E8E8E5] text-xs leading-relaxed text-[#171717] whitespace-pre-wrap font-sans">
              {selectedEnquiry.message}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E5] text-xs">
              <span className="text-[#6B6B6B] font-mono text-[11px]">Submitted: {selectedEnquiry.created_at}</span>
              <a
                href={`mailto:${selectedEnquiry.email}?subject=RE: ${encodeURIComponent(selectedEnquiry.subject)}`}
                onClick={() => updateStatus(selectedEnquiry.id, "REPLIED")}
                className="px-5 py-2 rounded-full bg-[#171717] text-white font-semibold hover:bg-[#2A2A28] inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
