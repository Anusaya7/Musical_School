"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";
import { Upload, Copy, Check } from "lucide-react";

interface MediaItem {
  id: number;
  filename: string;
  filepath: string;
  filesize: number;
  filetype: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadMedia = () => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMediaItems(data);
      });
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        loadMedia();
      } else {
        alert("Failed to upload image.");
      }
    } catch {
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E5]">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Media Library &amp; Assets</h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Upload project photos, site blueprints, and logos for CMS usage
            </p>
          </div>

          <label className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#2A2A28] cursor-pointer transition-all shadow-md">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading Image..." : "Upload New Image"}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-[#E8E8E5] overflow-hidden p-2 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#181818] mb-2">
                <Image src={item.filepath} alt={item.filename} fill className="object-cover" />
              </div>
              <div className="px-1 text-[11px] truncate text-[#171717] font-mono mb-2">{item.filename}</div>
              <button
                onClick={() => copyUrl(item.id, item.filepath)}
                className="w-full py-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#171717] hover:text-white text-[11px] font-mono font-medium flex items-center justify-center gap-1 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
