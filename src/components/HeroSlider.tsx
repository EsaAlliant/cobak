"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setSlides(body?.data || []))
      .catch(() => setSlides([]));
  }, []);

  const published = useMemo(
    () =>
      (slides || [])
        .filter((slide) => slide.is_published !== false)
        .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)),
    [slides]
  );

  useEffect(() => {
    if (published.length < 2) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % published.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [published.length]);

  useEffect(() => { if (active >= published.length) setActive(0); }, [published.length, active]);

  // Belum ada data (masih memuat) atau tidak ada slide terpublikasi: hero default sederhana.
  if (slides === null || published.length === 0) {
    return (
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Portal Resmi Pemerintah Desa</span>
            <h1>Desa yang tumbuh,<br /><em>terhubung, dan berdaya.</em></h1>
            <p>Informasi publik, potensi lokal, dan layanan digital desa dalam satu tempat.</p>
            <div className="hero-actions">
              <Link href="/profil" className="button primary">Mengenal Desa <i className="fa-solid fa-arrow-right" /></Link>
              <Link href="/umkm" className="button secondary">Jelajahi UMKM</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orb one" />
            <div className="hero-orb two" />
            <div className="hero-card">
              <i className="fa-solid fa-leaf" />
              <span>Untuk warga, oleh warga.</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Tampilan gambar penuh, tanpa judul/overlay — hanya foto + navigasi dot/panah.
  return (
    <section className="hero-slider">
      {published.map((item, index) => {
        const image = <img src={item.image_url} alt={item.title || "Slide"} className={`hero-slide-img ${index === active ? "is-active" : ""}`} aria-hidden={index !== active} />;
        return (
          <div key={item.id} className={`hero-slide-frame ${index === active ? "is-active" : ""}`}>
            {item.cta_url ? <Link href={item.cta_url} aria-label={item.title}>{image}</Link> : image}
          </div>
        );
      })}

      {published.length > 1 ? (
        <>
          <button type="button" className="hero-slide-nav prev" onClick={() => setActive((current) => (current - 1 + published.length) % published.length)} aria-label="Slide sebelumnya">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button type="button" className="hero-slide-nav next" onClick={() => setActive((current) => (current + 1) % published.length)} aria-label="Slide berikutnya">
            <i className="fa-solid fa-chevron-right" />
          </button>
          <div className="hero-slide-dots">
            {published.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
                aria-label={`Ke slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
