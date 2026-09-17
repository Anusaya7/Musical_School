"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface UseCaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  badge?: string;
}

const useCases: UseCaseItem[] = [
  {
    id: "concept-vis",
    title: "Concept Visualization",
    category: "Concept",
    description: "Translate early moodboards, massing studies, and napkin concepts into high-impact visual direction decks for stakeholders.",
    image: "/images/concept_pavilion_1.jpg",
    badge: "Core Workflow",
  },
  {
    id: "interior-design",
    title: "Interior Design",
    category: "Interior",
    description: "Visualize bespoke residential lounges, boutique hotel suites, and minimalist commercial spaces with custom lighting and furniture.",
    image: "/images/interior_lounge_1.jpg",
    badge: "Popular",
  },
  {
    id: "exterior-design",
    title: "Exterior Design",
    category: "Architecture",
    description: "Generate atmospheric facade renders, coastal modern villas, and urban developments with authentic sunlight physics.",
    image: "/images/architecture_exterior_1.jpg",
  },
  {
    id: "product-vis",
    title: "Product Visualization",
    category: "Industrial Design",
    description: "Create studio-lit product renders for furniture, consumer electronics, and luxury hardware without expensive physical prototypes.",
    image: "/images/product_design_1.jpg",
  },
  {
    id: "sketch-to-image",
    title: "Sketch to Image",
    category: "CAD & Pencil",
    description: "Turn hand-drawn iPad Procreate line art or vector CAD elevations directly into photorealistic 8K spatial renderings.",
    image: "/images/sketch_elevation_1.jpg",
    badge: "AI Powered",
  },
  {
    id: "style-exploration",
    title: "Style Exploration",
    category: "Material Synthesis",
    description: "Experiment instantly with travertine stone, brushed bronze, raw micro-cement, and fluted glass textures across any surface.",
    image: "/images/material_texture_1.jpg",
  },
  {
    id: "image-enhancement",
    title: "Image Enhancement",
    category: "Lighting & Sky",
    description: "Relight existing spatial renders, adjust sun positions, add atmospheric volumetric fog, and fix shadow compositions.",
    image: "/images/lifestyle_patio_1.jpg",
  },
  {
    id: "image-upscaling",
    title: "Image Upscaling",
    category: "Post-Processing",
    description: "Upscale 1080p draft previews to print-ready 8K Ultra-HD with intelligent edge sharpening and sub-pixel detail reconstruction.",
    image: "/images/creative_facade_1.jpg",
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-32 bg-[#F7F7F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
            01 / Workflows & Solutions
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-5">
            Built for Every Creative Workflow
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            Engineered specifically for architects, interior designers, creative directors, and industrial design studios.
          </p>
        </div>

        {/* Cards Grid (4 columns on lg screens for balanced 8-card grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E8E8E5] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#D4D4CE] hover:-translate-y-1"
            >
              {/* Card Image Header */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181818]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Top Category Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-[#171717] border border-[#E8E8E5] shadow-xs">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="bg-[#171717] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-[#171717] tracking-tight mb-2 group-hover:text-[#2A2A28] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-3 border-t border-[#E8E8E5]/70 flex items-center justify-between text-xs font-semibold text-[#171717]">
                  <span>Explore Workflow</span>
                  <div className="w-7 h-7 rounded-full bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

