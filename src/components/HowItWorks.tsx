"use client";

import { Upload, Sliders, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload",
      description: "Upload your sketch, image, model, or reference.",
    },
    {
      number: "02",
      icon: Sliders,
      title: "Describe",
      description: "Tell the AI what you want to create.",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Generate",
      description: "Receive a polished visualization in seconds.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#FFFFFF] border-y border-[#E8E8E5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block mb-3">
            04 / Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight mb-5">
            How FORMA AI Works
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            From initial concept wireframe to final presentation render in three effortless steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#F7F7F5] rounded-3xl p-8 border border-[#E8E8E5] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#D4D4CE]"
              >
                <div>
                  {/* Step Editorial Number */}
                  <div className="text-6xl lg:text-7xl font-bold font-mono text-[#171717]/20 tracking-tighter mb-6">
                    {step.number}
                  </div>

                  {/* Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E8E8E5] flex items-center justify-center text-[#171717] mb-6 shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#171717] mb-3 tracking-tight">
                    {step.number} — {step.title}
                  </h3>
                  <p className="text-base text-[#6B6B6B] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-[#171717]/30 z-10">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

