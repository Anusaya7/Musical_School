import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORMA AI — Generative Architectural & Product Visualization Studio",
  description: "Transform concepts, wireframes, and sketches into photorealistic 8K studio-grade visualizations in seconds with powerful generative AI for architects and designers.",
  keywords: ["AI visualization", "Architectural rendering AI", "Sketch to render", "Interior design AI", "3D product rendering", "FORMA AI"],
  authors: [{ name: "FORMA AI Team" }],
  openGraph: {
    title: "FORMA AI — Generative Architectural & Product Visualization Studio",
    description: "Transform concepts, wireframes, and sketches into photorealistic studio-grade visualizations in seconds.",
    url: "https://forma-ai.studio",
    siteName: "FORMA AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FORMA AI — Next-Gen AI Visualization",
    description: "Architectural & product visualization powered by generative AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#F7F7F5] text-[#171717] antialiased selection:bg-[#171717] selection:text-[#FFFFFF] min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

