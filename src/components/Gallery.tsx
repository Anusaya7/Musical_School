"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Eye } from "lucide-react";
import GalleryModal, { GalleryItem } from "./GalleryModal";

const galleryData: GalleryItem[] = [
  {
    id: "g1",
    title: "Cliffside Cantilevered Villa",
    category: "Architecture",
    image: "/images/hero_villa_render.jpg",
    aspect: "aspect-[16/9]",
    prompt: "Photorealistic cliffside architectural villa, board-formed concrete and warm timber cladding, twilight lighting over ocean, expansive floor-to-ceiling glass.",
    resolution: "8K UHD",
    style: "Minimal Brutalism",
    renderTime: "1.8s",
    lighting: "Dusk / Golden Hour Sunset",
    camera: "35mm Architectural Prime",
  },
  {
    id: "g2",
    title: "Organic Micro-Cement Lounge",
    category: "Interior",
    image: "/images/interior_lounge_1.jpg",
    aspect: "aspect-[4/3]",
    prompt: "Wabi-sabi modern living room interior, curved beige bouclé sofa, raw travertine organic coffee table, micro-cement walls, warm cove lighting.",
    resolution: "8K UHD",
    style: "Nordic Wabi-Sabi",
    renderTime: "1.6s",
    lighting: "Diffused Architectural Cove",
    camera: "50mm Soft Focus",
  },
  {
    id: "g3",
    title: "Structural Vector CAD Elevation",
    category: "Concept",
    image: "/images/sketch_elevation_1.jpg",
    aspect: "aspect-[16/9]",
    prompt: "Monochromatic architectural elevation sketch on off-white paper texture, precision vector CAD line drawing with structural grid.",
    resolution: "4K Vector",
    style: "Technical CAD Wireframe",
    renderTime: "0.9s",
    lighting: "Flat Studio Diagram",
    camera: "Isometric Technical",
  },
  {
    id: "g4",
    title: "Scandinavian Forest Pavilion",
    category: "Exterior",
    image: "/images/architecture_exterior_1.jpg",
    aspect: "aspect-[4/3]",
    prompt: "Scandinavian timber pavilion embedded in misty fir forest, warm ambient indoor glow, frosted glass louvers, architectural photography.",
    resolution: "8K UHD",
    style: "Nordic Minimalist",
    renderTime: "2.1s",
    lighting: "Foggy Sunrise Volumetric",
    camera: "24mm Ultra Wide Angle",
  },
  {
    id: "g5",
    title: "Minimalist Acoustic Speaker",
    category: "Product",
    image: "/images/product_design_1.jpg",
    aspect: "aspect-square",
    prompt: "Industrial design render of high-end acoustic speaker, matte anodized charcoal aluminum, raw stone base, soft studio box light.",
    resolution: "8K Studio",
    style: "Industrial Bauhaus",
    renderTime: "1.2s",
    lighting: "Softbox Studio Lighting",
    camera: "85mm Macro Portrait",
  },
  {
    id: "g6",
    title: "Coastal Terrace Lounge",
    category: "Lifestyle",
    image: "/images/lifestyle_patio_1.jpg",
    aspect: "aspect-[16/9]",
    prompt: "Sun-drenched Mediterranean coastal terrace with teak lounge chairs, ocean horizon view, olive tree shade shadows, editorial photography.",
    resolution: "8K UHD",
    style: "Editorial Lifestyle",
    renderTime: "1.7s",
    lighting: "Midday Mediterranean Sun",
    camera: "35mm Editorial Lens",
  },
  {
    id: "g7",
    title: "Parametric Sculpture Facade",
    category: "Creative",
    image: "/images/creative_facade_1.jpg",
    aspect: "aspect-[4/3]",
    prompt: "Avant-garde parametric pavilion with fluid terracotta fins, dramatic chiaroscuro shadow play, museum spatial installation.",
    resolution: "8K UHD",
    style: "Parametric Avant-Garde",
    renderTime: "2.0s",
    lighting: "Dramatic Sunlight Ray",
    camera: "28mm Spatial Lens",
  },
  {
    id: "g8",
    title: "Concrete Atrium & Reflection Pool",
    category: "Architecture",
    image: "/images/concept_pavilion_1.jpg",
    aspect: "aspect-[16/9]",
    prompt: "Minimalist raw concrete atrium with shallow water reflection basin, louvered skylight, serene zen spatial atmosphere.",
    resolution: "8K UHD",
    style: "Modern Zen Brutalism",
    renderTime: "1.9s",
    lighting: "Direct Overhead Zenith",
    camera: "20mm Perspective Corrected",
  },
  {
    id: "g9",
    title: "Fluted Glass & Marble Partition",
    category: "Material",
    image: "/images/material_texture_1.jpg",
    aspect: "aspect-[4/3]",
    prompt: "Architectural material study of ribbed fluted glass, brushed bronze framing, and polished Arabescato marble slab texture.",
    resolution: "8K Macro",
    style: "Material Macro Study",
    renderTime: "1.4s",
    lighting: "Diffused Studio Rim",
    camera: "70mm Telephoto Macro",
  }
];

const categories = [
  "All",
  "Architecture",
  "Interior",
  "Exterior",
  "Product",
  "Concept",
  "Lifestyle",
  "Creative"
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryData.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#F7F7F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
              03 / Community & Showcase
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight">
              Explore What&apos;s Possible
            </h2>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search renders, styles, prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E8E8E5] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#171717] placeholder-[#6B6B6B] focus:outline-none focus:border-[#171717] transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-[#E8E8E5] pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#171717] text-white shadow-xs"
                  : "bg-[#FFFFFF] text-[#171717] border border-[#E8E8E5] hover:bg-[#E8E8E5]/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E8E8E5] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-[#D4D4CE] hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className={`relative ${item.aspect} w-full bg-[#181818] overflow-hidden`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-xs font-mono uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                      {item.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-2 font-mono">&quot;{item.prompt}&quot;</p>
                </div>
              </div>

              {/* Card Footer info */}
              <div className="p-4 flex items-center justify-between text-xs font-mono text-[#6B6B6B] border-t border-[#E8E8E5]/70">
                <span>{item.style}</span>
                <span className="text-[#171717] font-semibold">{item.resolution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

