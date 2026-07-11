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
  useEffect(() => { void load("umkm", (rows) => setRow(rows.find((item) => item.id === id) || null)); void load("umkm-products", setProducts); }, [id]);
  if (!row) return <p className="text-muted">Memuat profil UMKM…</p>;
  const contacts = [["fa-whatsapp", "WhatsApp", row.whatsapp, row.whatsapp ? `https://wa.me/${String(row.whatsapp).replace(/\D/g, "")}` : ""], ["fa-instagram", "Instagram", row.instagram, row.instagram], ["fa-facebook-f", "Facebook", row.facebook, row.facebook], ["fa-tiktok", "TikTok", row.tiktok, row.tiktok], ["fa-shop", "Shopee", row.shopee, row.shopee], ["fa-bag-shopping", "Tokopedia", row.tokopedia, row.tokopedia]].filter((item) => item[2]);
  return <div className="umkm-detail">{row.photo_url ? <img src={String(row.photo_url)} alt={String(row.name)} className="umkm-detail-image" /> : <div className="umkm-detail-image" />}<div><span className="eyebrow">UMKM Desa Glagaharum</span><h1>{row.name}</h1><p className="lead">Milik {row.owner_name}</p><p>{row.description}</p><p><i className="fa-solid fa-location-dot" /> {row.address || "Alamat belum diisi"}</p>{row.maps_url ? <iframe title="Lokasi UMKM" src={String(row.maps_url).includes("embed") ? String(row.maps_url) : `https://www.google.com/maps?q=${encodeURIComponent(String(row.address || row.name))}&output=embed`} className="map-frame" loading="lazy" /> : null}<h2 className="mt-4">Produk</h2><div className="product-list">{products.filter((product) => product.umkm_id === id && product.is_active !== false).map((product) => <div key={String(product.id)}><strong>{product.name}</strong><span>{product.price ? `Rp${Number(product.price).toLocaleString("id-ID")}` : ""}</span><p>{product.description}</p></div>)}{!products.some((product) => product.umkm_id === id && product.is_active !== false) && <p className="text-muted">Produk belum ditambahkan.</p>}</div><div className="social-links detail-links">{contacts.map(([icon, label, , href]) => <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" aria-label={String(label)}><i className={`fa-brands ${icon}`} /></a>)}</div></div></div>;
}
