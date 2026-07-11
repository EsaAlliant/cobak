import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKETS = ["website", "gallery", "news", "umkm", "branding"] as const;

export async function POST(request: Request) {
  const session = await getSessionCookie();
  if (!session) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") || "");
    if (!(file instanceof File) || !BUCKETS.includes(bucket as (typeof BUCKETS)[number])) return NextResponse.json({ error: "File atau bucket tidak valid." }, { status: 422 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Ukuran file maksimal 8 MB." }, { status: 422 });
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const storage = getSupabaseAdmin().storage.from(bucket);
    const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = storage.getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengunggah file." }, { status: 500 });
  }
}
