"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

interface Service {
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    service_number: "01",
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    bullet_points: "",
    image: "/images/architecture_exterior_1.jpg",
    icon: "Compass",
    cta_label: "EXPLORE SERVICES",
    cta_link: "/contact",
    display_order: 0,
    is_published: 1,
  });

  const loadServices = () => {
    fetch("/api/services?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      });
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    const nextNum = (services.length + 1).toString().padStart(2, "0");
    setFormData({
      service_number: nextNum,
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      bullet_points: "",
      image: "/images/architecture_exterior_1.jpg",
      icon: "Compass",
      cta_label: "EXPLORE SERVICES",
      cta_link: "/contact",
      display_order: services.length + 1,
      is_published: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFormData({
      service_number: s.service_number,
      title: s.title,
      slug: s.slug || "",
      short_description: s.short_description,
      full_description: s.full_description,
      bullet_points: s.bullet_points || "",
      image: s.image || "/images/architecture_exterior_1.jpg",
      icon: s.icon || "Compass",
      cta_label: s.cta_label || "EXPLORE SERVICES",
      cta_link: s.cta_link || "/contact",
      display_order: s.display_order,
      is_published: s.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
    const method = editingService ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      loadServices();
    } else {
      alert("Failed to save service.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) loadServices();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Services Practice Management</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Manage architectural planning, statutory approvals, land surveying, and PMC service offerings (DB Source of Truth)
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#2A2A28] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] bg-[#F7F7F5] text-[#6B6B6B] font-mono uppercase">
                  <th className="py-3.5 px-4">No.</th>
                  <th className="py-3.5 px-4">Service Title</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Short Overview</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">{s.service_number}</td>
                    <td className="py-3.5 px-4 font-bold text-[#171717]">{s.title}</td>
                    <td className="py-3.5 px-4 font-mono text-[#6B6B6B] text-[11px]">{s.slug || "N/A"}</td>
                    <td className="py-3.5 px-4 text-[#6B6B6B] max-w-xs truncate">{s.short_description}</td>
                    <td className="py-3.5 px-4 font-mono">{s.display_order}</td>
                    <td className="py-3.5 px-4">
                      {s.is_published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#6B6B6B] text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#E8E8E5] text-[#171717] transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Service"
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
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border border-[#E8E8E5] shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-1 text-[#6B6B6B] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#171717] mb-6">
              {editingService ? "Edit Professional Service" : "Create New Professional Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.service_number}
                    onChange={(e) => setFormData({ ...formData, service_number: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-mono font-semibold uppercase mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. architectural-design"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Icon Name</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  >
                    <option value="Compass">Compass (Architectural)</option>
                    <option value="Layers">Layers (PMC)</option>
                    <option value="ShieldCheck">ShieldCheck (Approvals)</option>
                    <option value="MapPin">MapPin (Surveying)</option>
                    <option value="FileText">FileText (Consultancy)</option>
                    <option value="Factory">Factory (Industrial)</option>
                    <option value="Layout">Layout (Interiors)</option>
                    <option value="Eye">Eye (3D Render)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Short Overview *</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl p-3.5"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Capabilities / Bullet Points (comma separated)</label>
                <input
                  type="text"
                  placeholder="Architectural Planning, Building Design, Space Planning"
                  value={formData.bullet_points}
                  onChange={(e) => setFormData({ ...formData, bullet_points: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.cta_label}
                    onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">CTA Link Route</label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published === 1}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Publish on Public Services Page</span>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
