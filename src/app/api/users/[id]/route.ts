/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getActiveAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { updateUserSchema } from "@/lib/validators/users";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await getActiveAdminSession(); if (!actor) return NextResponse.json({ error: "Akses Admin diperlukan." }, { status: 403 });
  try {
    const { id } = await params; const parsed = updateUserSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 }); const input = parsed.data; const db = getSupabaseAdmin() as any;
    if (actor.session.userId === id && input.is_active === false) return NextResponse.json({ error: "Anda tidak dapat menonaktifkan akun sendiri." }, { status: 422 });
    if (input.email || input.password) { const auth = await db.auth.admin.updateUserById(id, { ...(input.email ? { email: input.email, email_confirm: true } : {}), ...(input.password ? { password: input.password } : {}) }); if (auth.error) throw auth.error; }
    const profile = { ...(input.name ? { name: input.name } : {}), ...(input.role ? { role: input.role } : {}), ...(input.phone !== undefined ? { phone: input.phone || null } : {}), ...(input.avatar_url !== undefined ? { avatar_url: input.avatar_url || null } : {}), ...(input.is_active !== undefined ? { is_active: input.is_active } : {}) };
    const { data, error } = await db.from("users").update(profile).eq("id", id).select().single(); if (error) throw error; return NextResponse.json({ data: { ...data, email: input.email } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui pengguna." }, { status: 500 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await getActiveAdminSession(); if (!actor) return NextResponse.json({ error: "Akses Admin diperlukan." }, { status: 403 });
  try { const { id } = await params; if (actor.session.userId === id) return NextResponse.json({ error: "Anda tidak dapat menghapus akun sendiri." }, { status: 422 }); const { error } = await (getSupabaseAdmin() as any).auth.admin.deleteUser(id); if (error) throw error; return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus pengguna." }, { status: 500 }); }
}
