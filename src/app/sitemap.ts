import type { MetadataRoute } from "next";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.vercel.app";

type IdRow = { id: string; updated_at?: string | null; created_at?: string | null };

async function getIds(table: string): Promise<IdRow[]> {
  try {
    const result = (await getSupabaseAdmin().from(table).select("id, updated_at, created_at")) as unknown as {
      data: IdRow[] | null;
    };
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/profil`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/berita`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/agenda`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/galeri`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/umkm`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const umkm = await getIds("umkm");
  const umkmRoutes: MetadataRoute.Sitemap = umkm.map((row) => ({
    url: `${SITE_URL}/umkm/${row.id}`,
    lastModified: row.updated_at || row.created_at || undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...umkmRoutes];
}
