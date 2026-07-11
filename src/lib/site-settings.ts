"use client";

import { useEffect, useState } from "react";

export type SocialLink = { label: string; url: string; icon: string };

export type WebsiteSettings = {
  namaWebsite: string;
  tagline: string;
  logoUrl: string;
  alamat: string;
  kontak: string;
  email: string;
  warnaUtama: string;
  profilSingkat: string;
  visi: string;
  misi: string[];
  footer: string;
  socials: SocialLink[];
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  namaWebsite: "Desa Glagaharum",
  tagline: "Transformasi Digital Desa Glagaharum",
  logoUrl: "",
  alamat: "Kantor Desa Glagaharum, Indonesia",
  kontak: "0812-0000-0000",
  email: "info@glagaharum.desa.id",
  warnaUtama: "#16794a",
  profilSingkat:
    "Desa Glagaharum menghadirkan informasi publik, layanan digital, dan etalase UMKM dalam satu portal yang mudah diakses.",
  visi: "Terwujudnya Desa Glagaharum yang maju, mandiri, inklusif, dan berdaya saing melalui transformasi digital.",
  misi: [
    "Menyediakan informasi desa yang terbuka, akurat, dan mudah diakses.",
    "Menguatkan pelayanan publik berbasis teknologi.",
    "Mendorong pertumbuhan UMKM dan potensi ekonomi lokal.",
  ],
  footer: "© Desa Glagaharum. Seluruh hak dilindungi.",
  socials: [
    { label: "Instagram", url: "#", icon: "fa-instagram" },
    { label: "Facebook", url: "#", icon: "fa-facebook-f" },
    { label: "YouTube", url: "#", icon: "fa-youtube" },
  ],
};

export function initialsFromText(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function useWebsiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_WEBSITE_SETTINGS);

  useEffect(() => {
    fetch("/api/website")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.settings && setSettings((current) => ({ ...current, ...data.settings })))
      .catch(() => undefined);
  }, []);

  return { settings, setSettings };
}
