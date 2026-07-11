/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
const guard = async () => (await getSessionCookie())?.role === "admin";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await guard())) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 }); try { const { id } = await params; const payload = await request.json(); const allowed = {
    name: payload.name?.trim(),
    email: payload.email?.trim(),
    role: payload.role,
    is_active: Boolean(payload.is_active)
}; if (allowed.role && !["admin", "operator"].includes(allowed.role)) return NextResponse.json({ error: "Role tidak valid." }, { status: 422 }); const { data, error } = await (getSupabaseAdmin() as any).from("users").update(allowed).eq("id", id).select().single(); if (error) throw error; return NextResponse.json({ data }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui pengguna." }, { status: 500 }); } }
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await guard())) return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 }); try { const { id } = await params; const db = getSupabaseAdmin() as any; const { error } = await db.auth.admin.deleteUser(id); if (error) throw error; return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus pengguna." }, { status: 500 }); } }
