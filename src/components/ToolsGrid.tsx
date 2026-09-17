"use client";

import { useState } from "react";
import Image from "next/image";
import { LucideIcon, Sparkles, ArrowRight, Layers, Compass, Maximize2, Palette, Wand2, Eye, SunMedium } from "lucide-react";

interface ToolItem {
  id: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  image: string;
  tag: string;
}

const tools: ToolItem[] = [
  {
    id: "img-gen",
    icon: Sparkles,
    name: "Image Generation",
    tagline: "Ultra-High Resolution Synthesis",
    description: "Generate 8K spatial compositions, natural lighting, and architectural textures from simple prompts.",
    image: "/images/hero_villa_render.jpg",
    tag: "Generative Engine",
  },
  {
    id: "img-enhance",
    icon: Wand2,
    name: "Image Enhancement",
    tagline: "Relighting & Tone Correction",
    description: "Refine existing renders with intelligent sun position adjustment, ambient occlusion, and sky replacement.",
    image: "/images/lifestyle_patio_1.jpg",
    tag: "Enhancer",
  },
  {
    id: "sketch-to-img",
    icon: Compass,
    name: "Sketch to Image",
    tagline: "CAD & Line Art to Realism",
    description: "Convert hand drawings or CAD vector elevations directly into photorealistic 3D spatial renders.",
    image: "/images/sketch_elevation_1.jpg",
    tag: "Geometry Locked",
  },
  {
    id: "style-ref",
    icon: Eye,
    name: "Style Reference",
    tagline: "Aesthetic & Palette Transfer",
    description: "Apply aesthetic moods, material palettes, and lighting signatures from moodboard references onto your model.",
    image: "/images/creative_facade_1.jpg",
    tag: "Style AI",
  },
  {
    id: "img-upscale",
    icon: Maximize2,
    name: "Image Upscaling",
    tagline: "Sub-Pixel Detail Reconstruction",
    description: "Upscale preview renders to 8K Ultra-HD resolution with crisp edge preservation for print portfolios.",
    image: "/images/architecture_exterior_1.jpg",
    tag: "8K Upscaler",
  },
  {
    id: "bg-edit",
    icon: SunMedium,
    name: "Background Editing",
    tagline: "Atmospheric & Environment Swap",
    description: "Replace backgrounds with custom landscape topographies, volumetric mist, or seasonal weather environments.",
    image: "/images/concept_pavilion_1.jpg",
    tag: "Environment Engine",
  },
  {
    id: "mat-trans",
    icon: Palette,
    name: "Material Transformation",
    tagline: "Real-Time Surface Swapping",
    description: "Swap concrete, travertine stone, ribbed oak timber, and tinted glass finishes on any building surface instantly.",
    image: "/images/material_texture_1.jpg",
    tag: "Surface Synthesis",
  },
  {
    id: "multi-angle",
    icon: Layers,
    name: "Multi-Angle Visualization",
    tagline: "3D Spatial View Continuity",
    description: "Produce eye-level, drone aerial, and close-up vignette camera angles while maintaining design consistency.",
    image: "/images/interior_lounge_1.jpg",
    tag: "Camera Continuity",
  },
];

export default function ToolsGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="tools" className="py-24 md:py-32 bg-[#FFFFFF] border-b border-[#E8E8E5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
            02 / Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-5">
            Everything You Need to Create Faster
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            A comprehensive suite of specialized AI tools designed to eliminate rendering bottlenecks and unlock boundless visual exploration.
          </p>
        </div>

        {/* Tools Grid (4 columns on lg screens for 8 balanced cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isHovered = hoveredId === tool.id;

            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredId(tool.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-[#F7F7F5] rounded-2xl border border-[#E8E8E5] p-5 flex flex-col justify-between transition-all duration-300 hover:bg-[#FFFFFF] hover:border-[#D4D4CE] hover:shadow-xl hover:-translate-y-1"
              >
                {/* Visual Header Thumbnail */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#181818] mb-5 border border-[#E8E8E5]/80">
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-700 ease-out ${
                      isHovered ? "scale-108" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-[#171717] border border-[#E8E8E5]">
                    {tool.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#171717] tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-[11px] font-mono text-[#6B6B6B]">{tool.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B6B6B] leading-relaxed mb-5">
                    {tool.description}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#171717] group-hover:text-[#2A2A28] pt-3 border-t border-[#E8E8E5]/60">
                  <span>Launch Tool</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isHovered ? "translate-x-1.5 text-[#171717]" : "text-[#6B6B6B]"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

