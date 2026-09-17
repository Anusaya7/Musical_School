"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, X } from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  category: string;
  area: string;
  description: string;
  completion_year: string;
  featured_image: string;
  gallery_images: string;
  is_featured: number;
  display_order: number;
  is_published: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    client: "",
    location: "",
    category: "Industrial Building",
    area: "",
    description: "",
    completion_year: "2023",
    featured_image: "/images/hero_villa_render.jpg",
    gallery_images: "[]",
    is_featured: 1,
    display_order: 0,
    is_published: 1,
  });

  const loadProjects = () => {
    fetch("/api/projects?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      });
  };

  useEffect(() => {
    fetch("/api/projects?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      });
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      client: "",
      location: "Pune, Maharashtra",
      category: "Industrial Building",
      area: "10,000 Sq.M.",
      description: "",
      completion_year: "2023",
      featured_image: "/images/hero_villa_render.jpg",
      gallery_images: "[]",
      is_featured: 1,
      display_order: 0,
      is_published: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      name: p.name,
      client: p.client,
      location: p.location,
      category: p.category,
      area: p.area || "",
      description: p.description,
      completion_year: p.completion_year || "2023",
      featured_image: p.featured_image,
      gallery_images: p.gallery_images || "[]",
      is_featured: p.is_featured,
      display_order: p.display_order,
      is_published: p.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
    const method = editingProject ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      loadProjects();
    } else {
      alert("Failed to save project.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) loadProjects();
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Project Portfolio Management</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Add, edit, publish or delete architectural and industrial projects
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#2A2A28] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Filter projects by title or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E8E8E5] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E5] bg-[#F7F7F5] text-[#6B6B6B] font-mono uppercase">
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Project Name</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-[#181818]">
                        <Image src={p.featured_image} alt={p.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#171717]">{p.name}</td>
                    <td className="py-3 px-4 text-[#6B6B6B]">{p.client}</td>
                    <td className="py-3 px-4 text-[#6B6B6B]">{p.location}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#F7F7F5] border border-[#E8E8E5] px-2 py-0.5 rounded font-mono text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.area || "N/A"}</td>
                    <td className="py-3 px-4">
                      {p.is_published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#6B6B6B] text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#E8E8E5] text-[#171717] transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Project"
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

      {/* Create / Edit Modal */}
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
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block font-mono font-semibold uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  >
                    <option>Industrial Building</option>
                    <option>Institutional &amp; Municipal</option>
                    <option>Corporate &amp; Green Energy</option>
                    <option>Architectural Masterplan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono font-semibold uppercase mb-1">Built Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 12,274 Sq.M."
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Featured Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold uppercase mb-1">Project Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#E8E8E5] rounded-xl p-3.5"
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
                  <span>Publish on Website</span>
                </label>
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured === 1}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Featured Project</span>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
