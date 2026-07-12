"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { clearClientSessionCache, setClientSessionCache } from "@/lib/client-session";
import { useWebsiteSettings } from "@/lib/site-settings";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, setSession } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { settings } = useWebsiteSettings();
  const logout = async () => { await supabase.auth.signOut(); await fetch("/api/logout", { method: "POST" }); clearClientSessionCache(); setSession(null); router.replace("/login"); };
  const confirmLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Keluar dari akun?",
      text: "Kamu perlu login kembali untuk mengakses dashboard.",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16794a",
    });
    if (result.isConfirmed) await logout();
  };
  useEffect(() => { fetch("/api/me", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then(async (body) => { if (!body?.session) { await logout(); return; } if (body.session.role !== session?.role || body.session.name !== session?.name || body.session.email !== session?.email || body.session.avatarUrl !== session?.avatarUrl) { await fetch("/api/session", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body.session) }); setClientSessionCache(body.session); setSession(body.session); router.refresh(); } }).catch(() => undefined); }, []);
  if (!session) return null;
  return <div className="admin-shell"><button className="mobile-menu" type="button" onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open}><i className="fa-solid fa-bars" /></button><div className={`admin-drawer ${open ? "open" : ""}`}><Sidebar role={session.role} name={session.name} avatarUrl={session.avatarUrl} onLogout={confirmLogout} onNavigate={() => setOpen(false)} /></div>{open ? <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Tutup menu" /> : null}<main className="admin-main"><header className="admin-topbar"><div><span>CMS {settings.namaWebsite}</span><h1>{settings.tagline}</h1></div><button type="button" onClick={confirmLogout}><i className="fa-solid fa-arrow-right-from-bracket" /> Keluar</button></header>{children}</main></div>;
}
