"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";

type Row = Record<string, string | boolean | null>;
const load = (resource: string, setter: (rows: Row[]) => void) => fetch(`/api/${resource}`).then((response) => response.ok ? response.json() : null).then((body) => setter(body?.data || [])).catch(() => setter([]));
const date = (value: string | null) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) : "";

export function PublicNews() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("news", setRows); }, []);
  return <div className="article-grid">{rows.filter((row) => row.is_published !== false).map((row) => <article className="article-card" key={String(row.id)}>{row.cover_url ? <img src={String(row.cover_url)} alt="" className="article-image" /> : <div className="article-image" />}<span>Berita Desa · {date((row.published_at || row.created_at) as string)}</span><h2>{row.title}</h2><p>{row.excerpt || String(row.content || "").slice(0, 150)}</p></article>)}{!rows.length && <p className="text-muted">Belum ada berita yang dipublikasikan.</p>}</div>;
}

/** Ringkasan berita terbaru untuk beranda, dibatasi jumlah item. */
export function PublicLatestNews({ limit = 3 }: { limit?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("news", setRows); }, []);
  const published = rows.filter((row) => row.is_published !== false).slice(0, limit);
  if (!published.length) return <p className="text-muted">Belum ada berita yang dipublikasikan.</p>;
  return <div className="news-list">{published.map((row) => <article key={String(row.id)}><span>{date((row.published_at || row.created_at) as string) || "Terbaru"}</span><h3>{row.title}</h3><Link href="/berita">Baca selengkapnya <i className="fa-solid fa-arrow-right" /></Link></article>)}</div>;
}

/** UMKM unggulan untuk beranda, dibatasi jumlah item. */
export function PublicFeaturedUmkm({ limit = 3 }: { limit?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("umkm", setRows); }, []);
  const active = rows.filter((row) => row.is_active !== false).slice(0, limit);
  if (!active.length) return <p className="text-muted">Belum ada UMKM aktif yang ditampilkan.</p>;
  return <div className="umkm-grid">{active.map((row, index) => <article key={String(row.id)} className="umkm-card">{row.photo_url ? <img src={String(row.photo_url)} alt="" className="umkm-art-image" /> : <div className={`umkm-art art-${(index % 3) + 1}`}><i className="fa-solid fa-bag-shopping" /></div>}<span>UMKM Desa</span><h3>{row.name}</h3><p>{row.description || "Produk unggulan warga desa."}</p></article>)}</div>;
}

/** Statistik ringkas beranda yang mengikuti pengaturan mode auto/manual admin. */
export function PublicMetrics() {
  const [stats, setStats] = useState<{ population: number; households: number; umkm: number; gallery: number; agenda: number } | null>(null);
  useEffect(() => { fetch("/api/homepage-stats").then((response) => response.ok ? response.json() : null).then((body) => body && setStats(body)).catch(() => undefined); }, []);
  const items: [string, string][] = [
    ["UMKM Terdaftar", String(stats?.umkm ?? "–")],
    ["Dokumentasi Galeri", String(stats?.gallery ?? "–")],
    ["Agenda Tahun Ini", String(stats?.agenda ?? "–")],
  ];
  return <>{items.map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</>;
}

export function PublicEvents() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("events", setRows); }, []);
  return <div className="agenda-list">{rows.filter((row) => row.is_published !== false).map((row) => { const start = new Date(String(row.starts_at)); return <article key={String(row.id)}><div className="date-block"><strong>{start.getDate()}</strong><span>{start.toLocaleString("id-ID", { month: "short" })}</span></div><div><h2>{row.title}</h2><p><i className="fa-solid fa-location-dot" /> {row.location || "Lokasi menyusul"}</p></div><span className="agenda-status">{date(row.starts_at as string)}</span></article>; })}{!rows.length && <p className="text-muted">Belum ada agenda yang dipublikasikan.</p>}</div>;
}

export function PublicGallery() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("gallery", setRows); }, []);
  return <div className="gallery-grid">{rows.filter((row) => row.is_published !== false).map((row) => <article className="gallery-item" key={String(row.id)} style={row.image_url ? { backgroundImage: `url(${row.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}><div><i className="fa-solid fa-camera" /><span>{row.title}</span></div></article>)}{!rows.length && <p className="text-muted">Belum ada foto galeri yang dipublikasikan.</p>}</div>;
}

export function PublicUmkm() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { void load("umkm", setRows); }, []);
  return <div className="directory-grid">{rows.filter((row) => row.is_active !== false).map((row) => <article className="directory-card" key={String(row.id)}><div className="directory-logo">{row.logo_url ? <img src={String(row.logo_url)} alt="" /> : <i className="fa-solid fa-store" />}</div><span>UMKM Desa</span><h2>{row.name}</h2><p>{row.description || "Produk lokal Desa Glagaharum."}</p><Link href={`/umkm/${row.id}`}>Lihat profil <i className="fa-solid fa-arrow-right" /></Link></article>)}{!rows.length && <p className="text-muted">Belum ada UMKM aktif yang ditampilkan.</p>}</div>;
}

export function PublicUmkmDetail({ id }: { id: string }) {
  const [row, setRow] = useState<Row | null>(null);
  const [products, setProducts] = useState<Row[]>([]);

  useEffect(() => {
    void load("umkm", (rows) =>
      setRow(rows.find((item) => item.id === id) || null)
    );

    void load("umkm-products", setProducts);
  }, [id]);

  if (!row) {
    return <p className="text-muted">Memuat profil UMKM...</p>;
  }

  const contacts = [
    [
      "fa-whatsapp",
      "WhatsApp",
      row.whatsapp,
      row.whatsapp
        ? `https://wa.me/${String(row.whatsapp).replace(/\D/g, "")}`
        : "",
    ],
    ["fa-instagram", "Instagram", row.instagram, row.instagram],
    ["fa-facebook-f", "Facebook", row.facebook, row.facebook],
    ["fa-tiktok", "TikTok", row.tiktok, row.tiktok],
    ["fa-shop", "Shopee", row.shopee, row.shopee],
    ["fa-bag-shopping", "Tokopedia", row.tokopedia, row.tokopedia],
  ].filter((item) => item[2]);

  const embedMap = row.maps_url
    ? String(row.maps_url)
    : "";

  return (
    <div className="umkm-detail-page">
      <Link href="/umkm" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Kembali ke UMKM
      </Link>

      <div className="umkm-detail-top">
        <div className="umkm-detail-photo">
          {row.photo_url ? (
            <img
              src={String(row.photo_url)}
              alt={String(row.name)}
              className="umkm-detail-image"
            />
          ) : (
            <div className="umkm-detail-image" />
          )}
        </div>

        <div className="umkm-detail-info">
          <span className="eyebrow">UMKM Desa Glagaharum</span>

          <h1>{row.name}</h1>

          <p className="lead">
            Milik <strong>{row.owner_name}</strong>
          </p>

          <p>{row.description}</p>

          {/* Jangan tampilkan URL embed sebagai alamat */}
          {row.address &&
            !String(row.address).includes("google.com/maps") && (
              <p>
                <i className="fa-solid fa-location-dot" /> {row.address}
              </p>
            )}

          {contacts.length > 0 && (
            <div className="detail-links">
              {contacts.map(([icon, label, , href]) => (
                <a
                  key={String(label)}
                  href={String(href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary"
                >
                  <i className={`fa-brands ${icon}`} /> {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {embedMap && (
        <section className="umkm-map-section">
          <h2>Lokasi UMKM</h2>

          <iframe
            title="Lokasi UMKM"
            src={embedMap}
            className="map-frame"
            loading="lazy"
            allowFullScreen
          />
        </section>
      )}

      <section className="product-section">
        <h2>Produk</h2>

        <div className="product-list">
          {products
            .filter(
              (product) =>
                product.umkm_id === id &&
                product.is_active !== false
            )
            .map((product) => (
              <div
                key={String(product.id)}
                className="product-card"
              >
                <strong>{product.name}</strong>

                {product.price && (
                  <span>
                    Rp
                    {Number(product.price).toLocaleString("id-ID")}
                  </span>
                )}

                <p>{product.description}</p>
              </div>
            ))}

          {!products.some(
            (product) =>
              product.umkm_id === id &&
              product.is_active !== false
          ) && (
            <p className="text-muted">
              Produk belum ditambahkan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
