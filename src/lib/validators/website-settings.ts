import { z } from "zod";

const url = z.string().trim().url("URL tidak valid.").optional().or(z.literal(""));
export const websiteSettingsSchema = z.object({
  nama_website: z.string().trim().min(3, "Nama website minimal 3 karakter.").max(120),
  tagline: z.string().trim().max(180).optional(), logo_url: url, favicon_url: url,
  alamat: z.string().trim().max(500).optional(), phone: z.string().trim().max(30).optional(), whatsapp: z.string().trim().max(30).optional(), email: z.string().trim().email("Email tidak valid.").optional().or(z.literal("")), office_hours: z.string().trim().max(180).optional(), maps_embed_url: url,
  facebook: url, instagram: url, tiktok: url, youtube: url,
  footer_description: z.string().trim().max(500).optional(), footer_copyright: z.string().trim().max(250).optional(),
  stats_mode: z.enum(["auto", "manual"]), stat_population: z.coerce.number().int().min(0).max(10000000).optional().default(0), stat_households: z.coerce.number().int().min(0).max(1000000).optional().default(0), stat_umkm: z.coerce.number().int().min(0).max(1000000), stat_gallery: z.coerce.number().int().min(0).max(1000000), stat_agenda: z.coerce.number().int().min(0).max(1000000),
  seo_title: z.string().trim().max(180).optional(), seo_description: z.string().trim().max(300).optional(), seo_keywords: z.string().trim().max(300).optional(), og_image_url: url, google_analytics_id: z.string().trim().max(60).optional(), google_search_console: z.string().trim().max(120).optional(),
});
