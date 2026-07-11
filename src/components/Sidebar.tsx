"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_LABELS, ROLE_MENUS, type UserRole } from "@/lib/roles";
import { initialsFromText, useWebsiteSettings } from "@/lib/site-settings";

export default function Sidebar({ role, name, onLogout }: { role: UserRole; name: string; onLogout: () => Promise<void> | void }) {
  const pathname = usePathname();
  const { settings } = useWebsiteSettings();
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/dashboard"><span>{settings.logoUrl ? <img src={settings.logoUrl} alt="" /> : initialsFromText(settings.namaWebsite)}</span><strong>{settings.namaWebsite}<small>CMS Pemerintah Desa</small></strong></Link>
      <div className="admin-user"><span className="admin-avatar">{initialsFromText(name)}</span><div><strong>{name}</strong><small>{ROLE_LABELS[role]}</small></div></div>
      <nav className="admin-nav">{ROLE_MENUS[role].map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}><i className={`fa-solid ${item.icon}`} />{item.label}</Link>)}</nav>
      <button type="button" className="admin-signout" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket" /> Keluar</button>
    </aside>
  );
}
