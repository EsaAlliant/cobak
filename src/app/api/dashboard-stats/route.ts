import { NextResponse } from "next/server";
import { getActiveProfileSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const context = await getActiveProfileSession();
  if (!context) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 401 });
  try {
    const db = getSupabaseAdmin() as any;
    const [news, umkm, gallery, events, users] = await Promise.all(["news", "umkm", "gallery", "events", "users"].map((table) => db.from(table).select("id", { count: "exact", head: true })));
    const errors = [news, umkm, gallery, events, users].find((result) => result.error)?.error;
    if (errors) throw errors;
    if (context.session.role === "operator") return NextResponse.json({ umkm: umkm.count || 0, gallery: gallery.count || 0 });
    return NextResponse.json({ news: news.count || 0, umkm: umkm.count || 0, gallery: gallery.count || 0, events: events.count || 0, users: users.count || 0 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat statistik." }, { status: 500 }); }
}
