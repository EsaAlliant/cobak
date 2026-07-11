/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getActiveAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createUserSchema } from "@/lib/validators/users";

export async function GET(request: Request) {
  if (!(await getActiveAdminSession())) return NextResponse.json({ error: "Akses Admin diperlukan." }, { status: 403 });
  try {
    const { searchParams } = new URL(request.url); const page = Math.max(1, Number(searchParams.get("page") || 1)); const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 10))); const search = searchParams.get("search")?.trim() || "";
    const db = getSupabaseAdmin() as any; let query = db.from("users").select("id,name,role,is_active,phone,avatar_url,created_at", { count: "exact" }).order("created_at", { ascending: false }); if (search) query = query.ilike("name", `%${search}%`); const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1); if (error) throw error;
    const auth = await db.auth.admin.listUsers({ page: 1, perPage: 1000 }); if (auth.error) throw auth.error; const emailById = new Map(auth.data.users.map((user: { id: string; email?: string }) => [user.id, user.email || ""]));
    return NextResponse.json({ data: (data || []).map((user: { id: string }) => ({ ...user, email: emailById.get(user.id) || "" })), meta: { page, pageSize, total: count || 0 } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat pengguna." }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!(await getActiveAdminSession())) return NextResponse.json({ error: "Akses Admin diperlukan." }, { status: 403 });
  try {
    const parsed = createUserSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
    const input = parsed.data; const db = getSupabaseAdmin() as any; const auth = await db.auth.admin.createUser({ email: input.email, password: input.password, email_confirm: true }); if (auth.error || !auth.data.user) throw auth.error ?? new Error("Gagal membuat akun Auth.");
    const { data, error } = await db.from("users").insert({ id: auth.data.user.id, name: input.name, role: input.role, phone: input.phone || null, is_active: true }).select().single(); if (error) { await db.auth.admin.deleteUser(auth.data.user.id); throw error; }
    return NextResponse.json({ data: { ...data, email: input.email } }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat pengguna." }, { status: 500 }); }
}
