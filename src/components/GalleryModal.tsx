"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Copy, Check, Sliders, Camera, Sun } from "lucide-react";
import { useState } from "react";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  aspect: "aspect-square" | "aspect-[4/3]" | "aspect-[16/9]" | "aspect-[3/4]";
  prompt: string;
  resolution: string;
  style: string;
  renderTime: string;
  lighting: string;
  camera: string;
}

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Click Backdrop to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-5xl bg-[#FFFFFF] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E5] flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] text-[#171717] border border-[#E8E8E5] flex items-center justify-center transition-all shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Frame (Left Column) */}
        <div className="relative flex-1 bg-[#181818] min-h-[300px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Details & Prompt (Right Column) */}
        <div className="w-full lg:w-[380px] p-6 md:p-8 bg-[#F7F7F5] border-t lg:border-t-0 lg:border-l border-[#E8E8E5] flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#171717] text-white px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold">
                {item.category}
              </span>
              <span className="text-xs font-mono text-[#6B6B6B]">{item.resolution}</span>
            </div>

            <h3 className="text-2xl font-bold text-[#171717] mb-2">{item.title}</h3>
            <p className="text-xs text-[#6B6B6B] mb-6">Generated with FORMA Engine v4.2 • Render Time {item.renderTime}</p>

            {/* Prompt Box */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold uppercase text-[#171717]">Generation Prompt</span>
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs text-[#6B6B6B] hover:text-[#171717] flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E8E5] text-xs font-mono text-[#171717] leading-relaxed select-all">
                &quot;{item.prompt}&quot;
              </div>
            </div>

            {/* Metadata Parameters */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs py-2 border-b border-[#E8E8E5]">
                <span className="text-[#6B6B6B] flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-[#171717]" />
                  Lighting Setup
                </span>
                <span className="font-medium text-[#171717]">{item.lighting}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-[#E8E8E5]">
                <span className="text-[#6B6B6B] flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#171717]" />
                  Camera & Lens
                </span>
                <span className="font-medium text-[#171717]">{item.camera}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-[#E8E8E5]">
                <span className="text-[#6B6B6B] flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#171717]" />
                  Design Aesthetic
                </span>
                <span className="font-medium text-[#171717]">{item.style}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#171717] text-white font-medium text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-[#2A2A28] transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Similar Concept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
