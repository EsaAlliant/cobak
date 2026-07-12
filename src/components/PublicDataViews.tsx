"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Row = Record<string, string | boolean | null>;

const load = (resource: string, setter: (rows: Row[]) => void) =>
  fetch(`/api/${resource}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((body) => setter(body?.data || []))
    .catch(() => setter([]));

const date = (value: string | null) =>
  value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) : "";

/** Ambil satu koleksi CMS beserta status "sudah selesai dimuat" agar UI bisa membedakan loading vs kosong. */
function useCollection(resource: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    load(resource, (data) => {
      setRows(data);
      setLoaded(true);
    });
  }, [resource]);
  return { rows, loaded };
}

function GridSkeleton({ count = 3, variant = "card" }: { count?: number; variant?: "card" | "row" }) {
  return (
    <div className={variant === "card" ? "skeleton-grid" : "skeleton-list"}>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-block image" />
          <div className="skeleton-block text w-60" />
          <div className="skeleton-block text w-80" />
        </div>
      ))}
    </div>
  );
}

export function PublicNews() {
  const { rows, loaded } = useCollection("news");
  const [query, setQuery] = useState("");
  const published = rows.filter((row) => row.is_published !== false);
  const filtered = query.trim()
    ? published.filter((row) => String(row.title || "").toLowerCase().includes(query.trim().toLowerCase()))
    : published;

  if (!loaded) return <GridSkeleton count={6} />;

  return (
    <div>
      <div className="filter-bar">
        <div className="search-field">
          <i className="fa-solid fa-magnifying-glass" />
          <input placeholder="Cari judul berita..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      {!published.length ? (
        <p className="text-muted">Belum ada berita yang dipublikasikan.</p>
      ) : !filtered.length ? (
        <p className="text-muted">Tidak ada berita yang cocok dengan pencarian &quot;{query}&quot;.</p>
      ) : (
        <div className="article-grid">
          {filtered.map((row) => (
            <article className="article-card" key={String(row.id)}>
              {row.cover_url ? <img src={String(row.cover_url)} alt="" className="article-image" /> : <div className="article-image" />}
              <span>Berita Desa · {date((row.published_at || row.created_at) as string)}</span>
              <h2>{row.title}</h2>
              <p>{row.excerpt || String(row.content || "").slice(0, 150)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/** Ringkasan berita terbaru untuk beranda, dibatasi jumlah item. */
export function PublicLatestNews({ limit = 3 }: { limit?: number }) {
  const { rows, loaded } = useCollection("news");
  const published = rows.filter((row) => row.is_published !== false).slice(0, limit);
  if (!loaded) return <GridSkeleton count={limit} variant="row" />;
  if (!published.length) return <p className="text-muted">Belum ada berita yang dipublikasikan.</p>;
  return (
    <div className="news-list">
      {published.map((row) => (
        <article key={String(row.id)}>
          <span>{date((row.published_at || row.created_at) as string) || "Terbaru"}</span>
          <h3>{row.title}</h3>
          <Link href="/berita">
            Baca selengkapnya <i className="fa-solid fa-arrow-right" />
          </Link>
        </article>
      ))}
    </div>
  );
}

/** UMKM unggulan untuk beranda, dibatasi jumlah item. */
export function PublicFeaturedUmkm({ limit = 3 }: { limit?: number }) {
  const { rows, loaded } = useCollection("umkm");
  const active = rows.filter((row) => row.is_active !== false).slice(0, limit);
  if (!loaded) return <GridSkeleton count={limit} />;
  if (!active.length) return <p className="text-muted">Belum ada UMKM aktif yang ditampilkan.</p>;
  return (
    <div className="umkm-grid">
      {active.map((row, index) => (
        <article key={String(row.id)} className="umkm-card">
          {row.photo_url ? (
            <img src={String(row.photo_url)} alt="" className="umkm-art-image" />
          ) : (
            <div className={`umkm-art art-${(index % 3) + 1}`}>
              <i className="fa-solid fa-bag-shopping" />
            </div>
          )}
          <span>UMKM Desa</span>
          <h3>{row.name}</h3>
          <p>{row.description || "Produk unggulan warga desa."}</p>
        </article>
      ))}
    </div>
  );
}

/** Statistik ringkas beranda yang mengikuti pengaturan mode auto/manual admin. */
export function PublicMetrics() {
  const [stats, setStats] = useState<{ population: number; households: number; umkm: number; gallery: number; agenda: number } | null>(null);
  useEffect(() => {
    fetch("/api/homepage-stats")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => body && setStats(body))
      .catch(() => undefined);
  }, []);
  const items: [string, string][] = [
    ["UMKM Terdaftar", String(stats?.umkm ?? "–")],
    ["Dokumentasi Galeri", String(stats?.gallery ?? "–")],
    ["Agenda Tahun Ini", String(stats?.agenda ?? "–")],
  ];
  return <>{items.map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</>;
}

export function PublicEvents() {
  const { rows, loaded } = useCollection("events");
  if (!loaded) return <GridSkeleton count={4} variant="row" />;
  const published = rows.filter((row) => row.is_published !== false);
  if (!published.length) return <p className="text-muted">Belum ada agenda yang dipublikasikan.</p>;
  return (
    <div className="agenda-list">
      {published.map((row) => {
        const start = new Date(String(row.starts_at));
        return (
          <article key={String(row.id)}>
            <div className="date-block">
              <strong>{start.getDate()}</strong>
              <span>{start.toLocaleString("id-ID", { month: "short" })}</span>
            </div>
            <div>
              <h2>{row.title}</h2>
              <p><i className="fa-solid fa-location-dot" /> {row.location || "Lokasi menyusul"}</p>
            </div>
            <span className="agenda-status">{date(row.starts_at as string)}</span>
          </article>
        );
      })}
    </div>
  );
}

export function PublicGallery() {
  const { rows, loaded } = useCollection("gallery");
  if (!loaded) return <GridSkeleton count={8} />;
  const published = rows.filter((row) => row.is_published !== false);
  if (!published.length) return <p className="text-muted">Belum ada foto galeri yang dipublikasikan.</p>;
  return (
    <div className="gallery-grid">
      {published.map((row) => (
        <article
          className="gallery-item"
          key={String(row.id)}
          style={row.image_url ? { backgroundImage: `url(${row.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          <div><i className="fa-solid fa-camera" /><span>{row.title}</span></div>
        </article>
      ))}
    </div>
  );
}

export function PublicUmkm() {
  const { rows, loaded } = useCollection("umkm");
  const { rows: categories } = useCollection("categories");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const active = rows.filter((row) => row.is_active !== false);
  const filtered = useMemo(
    () =>
      active
        .filter((row) => category === "all" || row.category_id === category)
        .filter((row) => !query.trim() || String(row.name || "").toLowerCase().includes(query.trim().toLowerCase())),
    [active, category, query]
  );

  if (!loaded) return <GridSkeleton count={6} />;

  return (
    <div>
      <div className="filter-bar">
        <div className="search-field">
          <i className="fa-solid fa-magnifying-glass" />
          <input placeholder="Cari nama UMKM..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {categories.length ? (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Semua kategori</option>
            {categories.map((cat) => (
              <option key={String(cat.id)} value={String(cat.id)}>{String(cat.name)}</option>
            ))}
          </select>
        ) : null}
      </div>
      {!active.length ? (
        <p className="text-muted">Belum ada UMKM aktif yang ditampilkan.</p>
      ) : !filtered.length ? (
        <p className="text-muted">Tidak ada UMKM yang cocok dengan pencarian/kategori ini.</p>
      ) : (
        <div className="directory-grid">
          {filtered.map((row) => (
            <article className="directory-card" key={String(row.id)}>
              <div className="directory-logo">{row.logo_url ? <img src={String(row.logo_url)} alt="" /> : <i className="fa-solid fa-store" />}</div>
              <span>UMKM Desa</span>
              <h2>{row.name}</h2>
              <p>{row.description || "Produk lokal Desa Glagaharum."}</p>
              <Link href={`/umkm/${row.id}`}>Lihat profil <i className="fa-solid fa-arrow-right" /></Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function PublicUmkmDetail({ id }: { id: string }) {
  const [row, setRow] = useState<Row | null>(null);
  const [products, setProducts] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void load("umkm", (rows) => {
      setRow(rows.find((item) => item.id === id) || null);
      setLoaded(true);
    });
    void load("umkm-products", setProducts);
  }, [id]);

  if (!loaded) {
    return (
      <div className="detail-skeleton">
        <div className="skeleton-block image" />
        <div>
          <div className="skeleton-block text w-40" />
          <div className="skeleton-block text w-80" />
          <div className="skeleton-block text w-60" />
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-shop-slash" />
        <h2>UMKM tidak ditemukan</h2>
        <p>Data yang kamu cari mungkin sudah dihapus atau tautannya salah.</p>
        <Link href="/umkm" className="button primary">Kembali ke daftar UMKM</Link>
      </div>
    );
  }

  const contacts = [
    ["fa-whatsapp", "WhatsApp", row.whatsapp, row.whatsapp ? `https://wa.me/${String(row.whatsapp).replace(/\D/g, "")}` : ""],
    ["fa-instagram", "Instagram", row.instagram, row.instagram],
    ["fa-facebook-f", "Facebook", row.facebook, row.facebook],
    ["fa-tiktok", "TikTok", row.tiktok, row.tiktok],
    ["fa-shop", "Shopee", row.shopee, row.shopee],
    ["fa-bag-shopping", "Tokopedia", row.tokopedia, row.tokopedia],
  ].filter((item) => item[2]);

  return (
    <div className="umkm-detail">
      {row.photo_url ? <img src={String(row.photo_url)} alt={String(row.name)} className="umkm-detail-image" /> : <div className="umkm-detail-image" />}
      <div>
        <span className="eyebrow">UMKM Desa Glagaharum</span>
        <h1>{row.name}</h1>
        <p className="lead">Milik {row.owner_name}</p>
        <p>{row.description}</p>
        <p><i className="fa-solid fa-location-dot" /> {row.address || "Alamat belum diisi"}</p>
        {row.maps_url ? (
          <iframe
            title="Lokasi UMKM"
            src={String(row.maps_url).includes("embed") ? String(row.maps_url) : `https://www.google.com/maps?q=${encodeURIComponent(String(row.address || row.name))}&output=embed`}
            className="map-frame"
            loading="lazy"
          />
        ) : null}
        <h2 className="mt-4">Produk</h2>
        <div className="product-list">
          {products
            .filter((product) => product.umkm_id === id && product.is_active !== false)
            .map((product) => (
              <div key={String(product.id)}>
                <strong>{product.name}</strong>
                <span>{product.price ? `Rp${Number(product.price).toLocaleString("id-ID")}` : ""}</span>
                <p>{product.description}</p>
              </div>
            ))}
          {!products.some((product) => product.umkm_id === id && product.is_active !== false) && (
            <p className="text-muted">Produk belum ditambahkan.</p>
          )}
        </div>
        <div className="social-links detail-links">
          {contacts.map(([icon, label, , href]) => (
            <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" aria-label={String(label)}>
              <i className={`fa-brands ${icon}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
