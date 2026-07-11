/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() { const session = await getSessionCookie(); if (session?.role !== "admin") return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 }); try { const { data, error } = await (getSupabaseAdmin() as any).from("users").select("id,name,email,role,is_active,created_at").order("created_at", { ascending: false }); if (error) throw error; return NextResponse.json({ data }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat pengguna." }, { status: 500 }); } }
export async function POST(request: Request) { const session = await getSessionCookie(); if (session?.role !== "admin") return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 }); try { const { email, password, name, role } = await request.json(); if (!email || !password || !name || !["admin", "operator"].includes(role)) return NextResponse.json({ error: "Data pengguna tidak valid." }, { status: 422 }); const db = getSupabaseAdmin() as any; const auth = await db.auth.admin.createUser({ email, password, email_confirm: true }); if (auth.error || !auth.data.user) throw auth.error ?? new Error("Gagal membuat akun Auth."); const { data, error } = await db.from("users").insert({
    id: auth.data.user.id,
    name,
    email,
    role,
    is_active: true,
    updated_at: new Date().toISOString()
}).select().single(); if (error) { await db.auth.admin.deleteUser(auth.data.user.id); throw error; } return NextResponse.json({ data }, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat pengguna." }, { status: 500 }); } }
