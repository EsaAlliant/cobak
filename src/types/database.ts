export type UserRole = "admin" | "operator";

export type WebsiteSettingsRow = { id: string; nama_website: string; logo_url: string | null; alamat: string | null; phone: string | null; email: string | null; social_media: Record<string, string>; footer: string | null; seo: Record<string, string>; updated_at: string };
export type UmkmRow = { id: string; name: string; owner_name: string; category_id: string | null; address: string | null; whatsapp: string | null; maps_url: string | null; description: string | null; photo_url: string | null; logo_url: string | null; instagram: string | null; facebook: string | null; tiktok: string | null; shopee: string | null; tokopedia: string | null; website: string | null; is_active: boolean; created_at: string };
export type HeroSlideRow = { id: string; title: string; subtitle: string | null; image_url: string; cta_label: string | null; cta_url: string | null; sort_order: number | null; is_published: boolean; created_at: string };
