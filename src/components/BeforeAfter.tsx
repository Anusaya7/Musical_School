"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { SlidersHorizontal, ArrowLeftRight } from "lucide-react";

interface ComparisonPreset {
  id: string;
  name: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  description: string;
}

const presets: ComparisonPreset[] = [
  {
    id: "exterior",
    name: "Architectural Exterior",
    category: "Architecture",
    beforeImg: "/images/hero_villa_sketch.jpg",
    afterImg: "/images/hero_villa_render.jpg",
    beforeLabel: "Vector Sketch Concept",
    afterLabel: "8K Photorealistic Render",
    description: "Translating 2D architectural elevations and CAD drawings into atmospheric exterior visualizations with realistic material physics and twilight sun study.",
  },
  {
    id: "interior",
    name: "Luxury Living Interior",
    category: "Interior Design",
    beforeImg: "/images/sketch_elevation_1.jpg",
    afterImg: "/images/interior_lounge_1.jpg",
    beforeLabel: "Spatial Wireframe",
    afterLabel: "Wabi-Sabi Interior Render",
    description: "Transforming floorplans into bespoke interior lounge spaces featuring plaster finishes, travertine furniture, and warm cove lighting.",
  },
  {
    id: "product",
    name: "Industrial Product",
    category: "Product Design",
    beforeImg: "/images/sketch_elevation_1.jpg",
    afterImg: "/images/product_design_1.jpg",
    beforeLabel: "2D Contour Layout",
    afterLabel: "Studio Lighting Render",
    description: "Converting basic product sketches into studio-lit luxury furniture and consumer hardware renders with authentic material textures.",
  },
  {
    id: "pavilion",
    name: "Parametric Pavilion",
    category: "Conceptual Architecture",
    beforeImg: "/images/hero_villa_sketch.jpg",
    afterImg: "/images/concept_pavilion_1.jpg",
    beforeLabel: "Conceptual Line Work",
    afterLabel: "Organic Facade Synthesis",
    description: "Synthesizing complex geometric structural frames into serene architectural pavilions with sunlight shadow patterns.",
  },
];

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<ComparisonPreset>(presets[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Keep track of container width for pixel-perfect before/after image positioning
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="before-after" className="py-24 md:py-32 bg-[#FFFFFF] border-y border-[#E8E8E5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F5] border border-[#E8E8E5] text-xs font-mono tracking-wider uppercase text-[#171717] mb-4 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Visualizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-5">
            From Concept to Final Visual
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            Drag the handle below to compare raw conceptual inputs with FORMA AI’s photorealistic studio outputs.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                activePreset.id === preset.id
                  ? "bg-[#171717] text-white shadow-md"
                  : "bg-[#F7F7F5] text-[#171717] border border-[#E8E8E5] hover:bg-[#E8E8E5]/60"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
            className="relative aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E5] select-none cursor-ew-resize bg-[#181818]"
          >
            {/* AFTER Image (Full Background Layer) */}
            <Image
              src={activePreset.afterImg}
              alt={activePreset.afterLabel}
              fill
              className="object-cover pointer-events-none"
              priority
            />

            {/* BEFORE Image (Clipped Left Layer with fixed pixel width) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="relative h-full aspect-[16/9]"
                style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%" }}
              >
                <Image
                  src={activePreset.beforeImg}
                  alt={activePreset.beforeLabel}
                  fill
                  className="object-cover pointer-events-none"
                  priority
                />
              </div>
            </div>

            {/* Before Badge Label (Top-Left) */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#E8E8E5] text-xs font-semibold text-[#171717] shadow-sm pointer-events-none">
              BEFORE: {activePreset.beforeLabel}
            </div>

            {/* After Badge Label (Top-Right) */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-[#171717]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20 text-xs font-semibold text-white shadow-sm pointer-events-none">
              AFTER: {activePreset.afterLabel}
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle Center Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-[#171717] shadow-2xl border-2 border-[#171717] flex items-center justify-center transition-transform hover:scale-110">
                <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 text-[#171717]" />
              </div>
            </div>
          </div>

          {/* Active Preset Description Card */}
          <div className="mt-8 p-6 rounded-2xl bg-[#F7F7F5] border border-[#E8E8E5] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#171717] mb-1">
                {activePreset.name} Transformation
              </h3>
              <p className="text-sm text-[#6B6B6B] max-w-2xl">
                {activePreset.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono text-[#90908C]">FORMA Core v4</span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

