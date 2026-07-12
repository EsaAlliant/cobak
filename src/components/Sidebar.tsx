"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_LABELS, ROLE_MENUS, type UserRole } from "@/lib/roles";
import { initialsFromText, useWebsiteSettings } from "@/lib/site-settings";

export default function Sidebar({ role, name, avatarUrl, onLogout, onNavigate }: { role: UserRole; name: string; avatarUrl?: string; onLogout: () => Promise<void> | void; onNavigate?: () => void }) {
  const pathname = usePathname(); const { settings } = useWebsiteSettings();
  const active = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  return <aside className="admin-sidebar"><Link className="admin-brand" href="/dashboard" onClick={onNavigate}><span>{settings.logoUrl ? <img src={settings.logoUrl} alt="" /> : initialsFromText(settings.namaWebsite)}</span><strong>{settings.namaWebsite}<small>CMS Pemerintah Desa</small></strong></Link><div className="admin-user"><span className="admin-avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : initialsFromText(name)}</span><div><strong>{name}</strong><small>{ROLE_LABELS[role]}</small></div></div><nav className="admin-nav" aria-label="Navigasi dashboard">{ROLE_MENUS[role].map((item) => <Link key={item.href} href={item.href} onClick={onNavigate} className={active(item.href) ? "active" : ""} aria-current={active(item.href) ? "page" : undefined}><i className={`fa-solid ${item.icon}`} />{item.label}</Link>)}</nav><button type="button" className="admin-signout" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket" /> Keluar</button></aside>;
}
