"use client";

import { useEffect, useState } from "react";

export type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

export type WebsiteSettings = {
  namaWebsite: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;

  alamat: string;
  kontak: string;
  whatsapp: string;
  email: string;
  officeHours: string;

  mapsEmbedUrl: string;

  warnaUtama: string;

  profilSingkat: string;
  visi: string;
  misi: string[];

  footerDescription: string;
  footerCopyright: string;

  socials: SocialLink[];

  stats: {
    mode: "auto" | "manual";
    population: number;
    households: number;
    umkm: number;
    gallery: number;
    agenda: number;
  };

  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    googleAnalytics: string;
    searchConsole: string;
  };
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  namaWebsite: "Desa Glagaharum",

  tagline: "Transformasi Digital Desa Glagaharum",

  logoUrl: "",

  faviconUrl: "",

  alamat: "",

  kontak: "",

  whatsapp: "",

  email: "",

  officeHours: "",

  mapsEmbedUrl: "",

  warnaUtama: "#16794a",

  profilSingkat: "",

  visi: "",

  misi: [],

  footerDescription: "",

  footerCopyright: "",

  socials: [],

  stats: {
    mode: "auto",
    population: 0,
    households: 0,
    umkm: 0,
    gallery: 0,
    agenda: 0,
  },

  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    googleAnalytics: "",
    searchConsole: "",
  },
};

export function initialsFromText(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((v) => v[0])
    .join("")
    .toUpperCase();
}

export function useWebsiteSettings() {
  const [settings, setSettings] = useState(
    DEFAULT_WEBSITE_SETTINGS
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);

    setError("");

    try {
        
      const response = await fetch("/api/website", {
        cache: "no-store",
      });

      const body = await response.json();

      if (!response.ok || !body?.settings) {
        throw new Error("Gagal mengambil pengaturan.");
      }

      const row = body.settings;

      const social = row.social_media || {};

      const stats = row.homepage_stats || {};

      const seo = row.seo || {};

      setSettings({
        ...DEFAULT_WEBSITE_SETTINGS,

        namaWebsite: row.nama_website || "",

        tagline: row.tagline || "",

        logoUrl: row.logo_url || "",

        faviconUrl: row.favicon_url || "",

        alamat: row.alamat || "",

        kontak: row.phone || "",

        whatsapp: row.whatsapp || "",

        email: row.email || "",

        officeHours: row.office_hours || "",

        mapsEmbedUrl: row.maps_embed_url || "",

        footerDescription:
          row.footer_description || "",

        footerCopyright:
          row.footer_copyright ||
          row.footer ||
          "",

        socials: [
          {
            label: "Facebook",
            url: social.facebook,
            icon: "fa-facebook-f",
          },
          {
            label: "Instagram",
            url: social.instagram,
            icon: "fa-instagram",
          },
          {
            label: "TikTok",
            url: social.tiktok,
            icon: "fa-tiktok",
          },
          {
            label: "YouTube",
            url: social.youtube,
            icon: "fa-youtube",
          },
        ].filter((s) => s.url),

        stats: {
          mode:
            stats.mode === "manual"
              ? "manual"
              : "auto",

          population: Number(
            stats.population || 0
          ),

          households: Number(
            stats.households || 0
          ),

          umkm: Number(stats.umkm || 0),

          gallery: Number(
            stats.gallery || 0
          ),

          agenda: Number(
            stats.agenda || 0
          ),
        },

        seo: {
          title: seo.title || "",

          description:
            seo.description || "",

          keywords: seo.keywords || "",

          ogImage: seo.og_image || "",

          googleAnalytics:
            seo.google_analytics || "",

          searchConsole:
            seo.search_console || "",
        },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!settings.faviconUrl) return;

    let favicon =
      document.querySelector<HTMLLinkElement>(
        "link[rel='icon']"
      );

    if (!favicon) {
      favicon = document.createElement("link");

      favicon.rel = "icon";

      document.head.appendChild(favicon);
    }

    favicon.href = settings.faviconUrl;
  }, [settings.faviconUrl]);

  return {
    settings,
    loading,
    error,
    refresh,
    setSettings,
  };
}