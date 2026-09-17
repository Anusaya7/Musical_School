"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

interface Career {
  id: number;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  application_email: string;
  display_order: number;
  is_published: number;
}

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "Pune, Maharashtra",
    employment_type: "Full-Time",
    description: "",
    requirements: "",
    application_email: "projects@koralsdesign.com",
    display_order: 0,
    is_published: 1,
  });

  const loadCareers = () => {
    fetch("/api/careers?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCareers(data);
      });
  };

  useEffect(() => {
    fetch("/api/careers?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCareers(data);
      });
  }, []);

  const openCreateModal = () => {
    setEditingCareer(null);
    setFormData({
      title: "",
      location: "Pune, Maharashtra",
      employment_type: "Full-Time",
      description: "",
      requirements: "",
      application_email: "projects@koralsdesign.com",
      display_order: careers.length + 1,
      is_published: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Career) => {
    setEditingCareer(c);
    setFormData({
      title: c.title,
      location: c.location,
      employment_type: c.employment_type,
      description: c.description,
      requirements: c.requirements || "",
      application_email: c.application_email || "projects@koralsdesign.com",
      display_order: c.display_order,
      is_published: c.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCareer ? `/api/careers/${editingCareer.id}` : "/api/careers";
    const method = editingCareer ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      loadCareers();
    } else {
      alert("Failed to save job opening.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job position?")) return;
    const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
    if (res.ok) loadCareers();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Careers CMS Management</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Add, edit or remove publicly listed job openings for Korals Design Private Limited
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#2A2A28] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job Position</span>
          </button>
        </div>

        {/* Careers Table */}
        <div className="bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] bg-[#F7F7F5] text-[#6B6B6B] font-mono uppercase">
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Apply Email</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {careers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#171717]">{c.title}</td>
                    <td className="py-3.5 px-4 text-[#6B6B6B]">{c.location}</td>
                    <td className="py-3.5 px-4 font-mono">{c.employment_type}</td>
                    <td className="py-3.5 px-4 font-mono text-[#6B6B6B]">{c.application_email}</td>
                    <td className="py-3.5 px-4">
                      {c.is_published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#6B6B6B] text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#E8E8E5] text-[#171717] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E5] shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-1 text-[#6B6B6B] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#171717] mb-6">
              {editingCareer ? "Edit Job Position" : "Create New Job Position"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction Safety Manager"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Employment Type *</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract / Project-Based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Job Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl p-3.5"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Requirements (semicolon ; separated)</label>
                <textarea
                  rows={3}
                  placeholder="Degree in Civil Safety; 5+ years experience; DISH safety norms"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl p-3.5"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Application Email</label>
                <input
                  type="email"
                  required
                  value={formData.application_email}
                  onChange={(e) => setFormData({ ...formData, application_email: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published === 1}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Publish Job on Careers Page</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#E8E8E5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E8E8E5] text-[#171717] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#171717] text-white font-semibold hover:bg-[#2A2A28]"
                >
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
