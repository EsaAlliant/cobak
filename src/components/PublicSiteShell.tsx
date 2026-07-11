"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { initialsFromText, useWebsiteSettings } from "@/lib/site-settings";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/umkm", label: "UMKM" },
  { href: "/kontak", label: "Kontak" },
];

export default function PublicSiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { settings } = useWebsiteSettings();

  return (
    <div className="site-shell" style={{ "--brand": settings.warnaUtama } as CSSProperties}>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="site-brand" aria-label="Beranda Desa Glagaharum">
            <span className="site-brand-mark">{settings.logoUrl ? <img src={settings.logoUrl} alt="" /> : initialsFromText(settings.namaWebsite)}</span>
            <span><strong>{settings.namaWebsite}</strong><small>{settings.tagline}</small></span>
          </Link>
          <nav className="site-nav" aria-label="Navigasi utama">
            {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>{item.label}</Link>)}
          </nav>
          <Link href="/login" className="site-login"><i className="fa-solid fa-lock" /> Admin</Link>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div><div className="footer-title">{settings.namaWebsite}</div><p>{settings.profilSingkat}</p></div>
          <div><div className="footer-title">Kontak Desa</div><p>{settings.alamat}<br />{settings.kontak}<br />{settings.email}</p></div>
          <div><div className="footer-title">Ikuti Kami</div><div className="social-links">{settings.socials.map((social) => <a href={social.url} key={social.label} aria-label={social.label}><i className={`fa-brands ${social.icon}`} /></a>)}</div></div>
        </div>
        <div className="container footer-bottom">{settings.footer}</div>
      </footer>
    </div>
  );
}
