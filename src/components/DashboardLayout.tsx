"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { clearClientSessionCache } from "@/lib/client-session";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, setSession } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const logout = async () => { await supabase.auth.signOut(); await fetch("/api/logout", { method: "POST" }); clearClientSessionCache(); setSession(null); router.replace("/login"); };
  if (!session) return null;
  return <div className="admin-shell"><button className="mobile-menu" type="button" onClick={() => setOpen(true)} aria-label="Buka menu"><i className="fa-solid fa-bars" /></button><div className={`admin-drawer ${open ? "open" : ""}`}><Sidebar role={session.role} name={session.name} onLogout={logout} /></div>{open ? <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Tutup menu" /> : null}<main className="admin-main"><header className="admin-topbar"><div><span>CMS Desa Glagaharum</span><h1>Transformasi Digital Desa</h1></div><button type="button" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket" /> Keluar</button></header>{children}</main></div>;
}
