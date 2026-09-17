"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Layers,
  Mail,
  FileText,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("Admin");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthorized");
      })
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.username) setUsername(data.username);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    router.push("/admin");
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center text-[#171717]">
        <div className="flex items-center gap-3 font-mono text-sm">
          <div className="w-3 h-3 rounded-full bg-[#171717] animate-ping" />
          <span>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Screen
  if (!authenticated) {
    return <AdminLoginScreen onLoginSuccess={() => setAuthenticated(true)} />;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Projects CMS", href: "/admin/projects", icon: Building2 },
    { label: "Services CMS", href: "/admin/services", icon: Layers },
    { label: "Careers CMS", href: "/admin/careers", icon: Briefcase },
    { label: "Enquiries DB", href: "/admin/enquiries", icon: Mail },
    { label: "Site Content", href: "/admin/content", icon: FileText },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#171717] flex flex-col md:flex-row">
      {/* Mobile Header Topbar */}
      <div className="md:hidden bg-[#181818] text-white p-4 flex items-center justify-between z-40">
        <div className="relative h-7 w-[160px]">
          <Image
            src="/images/logo/korals_logo_white.svg"
            alt="Korals Design Logo"
            fill
            className="object-contain object-left"
          />
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#181818] text-white z-50 flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="mb-8 pt-2">
            <Link href="/" className="inline-block">
              <div className="relative h-9 w-[190px]">
                <Image
                  src="/images/logo/korals_logo_white.svg"
                  alt="Korals Design Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <span className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">
              CMS Admin Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-[#171717] font-semibold shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#171717]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Actions */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Logged in as {username}</p>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Session Active
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <Link href="/" target="_blank" className="text-white/60 hover:text-white underline text-[11px]">
              View Live Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// Subcomponent: Admin Login Screen
function AdminLoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#222222] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
        <div className="text-center">
          <div className="relative h-12 w-[220px] mx-auto mb-4">
            <Image
              src="/images/logo/korals_logo_white.svg"
              alt="Korals Design Pvt Ltd Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs font-mono text-white/60 uppercase tracking-widest">
            CMS Admin Authentication
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-white/80 uppercase mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/80 uppercase mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-white text-[#171717] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#F0F0ED] transition-all shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-[#171717]" />
            <span>{loading ? "Authenticating..." : "Sign In to Admin CMS"}</span>
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-white/40 pt-4 border-t border-white/10">
          Korals Design Private Limited • Pune Headquarters
        </div>
      </div>
    </div>
  );
}
