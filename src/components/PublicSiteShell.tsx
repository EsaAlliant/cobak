"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  initialsFromText,
  useWebsiteSettings,
} from "@/lib/site-settings";

import BackToTopButton from "@/components/BackToTopButton";
import ScrollProgress from "@/components/ScrollProgress";
import ServerConnectionToast from "@/components/ServerConnectionToast";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/umkm", label: "UMKM" },
  { href: "/kontak", label: "Kontak" },
];

export default function PublicSiteShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const {
    settings,
    loading,
    error,
  } = useWebsiteSettings();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div
      className="site-shell"
      style={
        {
          "--brand": settings.warnaUtama,
        } as CSSProperties
      }
    >
      {/* Global Components */}

      <ScrollProgress />

      <BackToTopButton />

      <ServerConnectionToast loading={loading} />

      {/* Header */}

      <header className="site-header">
        <div className="container site-header-inner">
          <Link
            href="/"
            className="site-brand"
            aria-label={`Beranda ${settings.namaWebsite}`}
          >
            <span className="site-brand-mark">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={`Logo ${settings.namaWebsite}`}
                />
              ) : (
                initialsFromText(settings.namaWebsite)
              )}
            </span>

            <span>
              <strong>{settings.namaWebsite}</strong>
              <small>{settings.tagline}</small>
            </span>
          </Link>

          <nav
            className="site-nav"
            aria-label="Navigasi utama"
          >
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "active" : ""}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/login"
            className="site-login"
          >
            <i className="fa-solid fa-lock" />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      {/* Main */}

      <main>{children}</main>

      {/* Footer */}

      <footer className="site-footer">
        <div className="container footer-grid">
          <section>
            <div className="footer-title">
              {settings.namaWebsite}
            </div>

            <p>
              {settings.footerDescription ||
                "Website resmi Pemerintah Desa Glagaharum."}
            </p>
          </section>

          <section>
            <div className="footer-title">
              Kontak Desa
            </div>

            {(settings.alamat ||
              settings.kontak ||
              settings.email) && (
              <address
                style={{
                  fontStyle: "normal",
                  lineHeight: 1.8,
                }}
              >
                {settings.alamat}

                {settings.kontak && (
                  <>
                    <br />
                    {settings.kontak}
                  </>
                )}

                {settings.email && (
                  <>
                    <br />
                    {settings.email}
                  </>
                )}
              </address>
            )}
          </section>

          {settings.socials.length > 0 && (
            <section>
              <div className="footer-title">
                Ikuti Kami
              </div>

              <div className="social-links">
                {settings.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <i
                      className={`fa-brands ${social.icon}`}
                    />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="container footer-bottom">
          {settings.footerCopyright ||
            `© ${new Date().getFullYear()} ${settings.namaWebsite}. Semua hak dilindungi.`}
        </div>
      </footer>

      {/* Development Error */}

      {process.env.NODE_ENV === "development" &&
        error && (
          <div
            style={{
              position: "fixed",
              left: 20,
              bottom: 20,
              zIndex: 99999,
              background: "#dc2626",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              boxShadow:
                "0 10px 20px rgba(0,0,0,.2)",
            }}
          >
            {error}
          </div>
        )}
    </div>
  );
}