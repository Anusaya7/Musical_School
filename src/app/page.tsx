import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BeforeAfter from "@/components/BeforeAfter";
import UseCases from "@/components/UseCases";
import ToolsGrid from "@/components/ToolsGrid";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import FeatureSpotlight from "@/components/FeatureSpotlight";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#171717]">
      <Navbar />
      <Hero />
      <BeforeAfter />
      <UseCases />
      <ToolsGrid />
      <Gallery />
      <HowItWorks />
      <FeatureSpotlight />
      <CTA />
      <Footer />
    </main>
  );
}
