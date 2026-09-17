"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin, X, Search, ArrowRight } from "lucide-react";

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  const categories = ["All", "Industrial Building", "Institutional & Municipal", "Corporate & Green Energy"];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#181818] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md">
              PORTFOLIO &amp; CASE STUDIES
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Featured Projects Portfolio
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-normal">
              Industrial facilities, municipal civil developments, and corporate campuses engineered by Korals Design Private Limited across Maharashtra.
            </p>
          </div>
        </div>
      </section>

      {/* Main Portfolio Grid */}
      <section className="py-20 bg-[#F7F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#E8E8E5] pb-6">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#171717] text-white shadow-xs"
                      : "bg-white text-[#171717] border border-[#E8E8E5] hover:bg-[#E8E8E5]/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search project or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E8E5] rounded-full pl-10 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="group relative bg-white rounded-3xl border border-[#E8E8E5] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-[#D4D4CE] hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full bg-[#181818] overflow-hidden">
                  <Image
                    src={p.featured_image || "/images/architecture_exterior_1.jpg"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="text-xs font-mono uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                        {p.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block mb-1">
                    CLIENT: {p.client}
                  </span>
                  <h3 className="text-xl font-bold text-[#171717] mb-2 group-hover:text-[#2A2A28]">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs font-mono text-[#171717]">
                    <span>Area: {p.area || "N/A"}</span>
                    <span className="font-semibold text-[#6B6B6B]">{p.completion_year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedProject(null)} />
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E5] flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#171717] border border-[#E8E8E5] flex items-center justify-center transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative flex-1 bg-[#181818] min-h-[300px] md:min-h-[450px]">
              <Image
                src={selectedProject.featured_image}
                alt={selectedProject.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="w-full md:w-[380px] p-6 md:p-8 bg-[#F7F7F5] border-t md:border-t-0 md:border-l border-[#E8E8E5] flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="inline-block bg-[#171717] text-white px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-[#171717] mb-2">{selectedProject.name}</h3>
                <p className="text-xs font-mono text-[#6B6B6B] mb-6">Client: {selectedProject.client}</p>

                <div className="space-y-3 mb-6 text-xs border-y border-[#E8E8E5] py-4">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Location</span>
                    <span className="font-semibold text-[#171717]">{selectedProject.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Total Built Area</span>
                    <span className="font-semibold text-[#171717]">{selectedProject.area || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Year</span>
                    <span className="font-semibold text-[#171717]">{selectedProject.completion_year}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-6">
                  {selectedProject.description}
                </p>
              </div>

              <Link
                href="/contact"
                onClick={() => setSelectedProject(null)}
                className="w-full py-3.5 rounded-full bg-[#171717] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#2A2A28] transition-all"
              >
                <span>Enquire About Similar Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
