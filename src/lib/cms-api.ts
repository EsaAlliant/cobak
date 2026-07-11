/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { UserRole } from "@/lib/roles";

export type CmsTable = "pages" | "news" | "gallery" | "events" | "umkm" | "users" | "categories" | "umkm_products" | "umkm_branding" | "social_media";

async function authorize(roles: UserRole[]) {
  const session = await getSessionCookie();
  return session && roles.includes(session.role) ? session : null;
}

export async function listCollection(table: CmsTable) {
  try {
    const { data, error } = await (getSupabaseAdmin() as any)
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

function errorResponse(error: unknown) {
  console.error("CMS API ERROR:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : String(error),
      detail: error,
    },
    { status: 500 }
  );
}

export async function createCollection(request: Request, table: CmsTable, roles: UserRole[]) {
  const session = await authorize(roles); if (!session) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 });
  try { const payload = await request.json(); const { data, error } = await (getSupabaseAdmin() as any).from(table).insert(payload).select().single(); if (error) throw error; return NextResponse.json({ data }, { status: 201 }); } catch (error) { return errorResponse(error); }
}

export async function updateCollection(request: Request, table: CmsTable, id: string, roles: UserRole[]) {
  const session = await authorize(roles); if (!session) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 });
  try { const payload = await request.json(); const { data, error } = await (getSupabaseAdmin() as any).from(table).update(payload).eq("id", id).select().single(); if (error) throw error; return NextResponse.json({ data }); } catch (error) { return errorResponse(error); }
}

export async function deleteCollection(table: CmsTable, id: string, roles: UserRole[]) {
  const session = await authorize(roles); if (!session) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 });
  try { const { error } = await (getSupabaseAdmin() as any).from(table).delete().eq("id", id); if (error) throw error; return NextResponse.json({ ok: true }); } catch (error) { return errorResponse(error); }
}
