/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() { try { const { data, error } = await (getSupabaseAdmin() as any).from("website_settings").select("*").limit(1).maybeSingle(); if (error) throw error; return NextResponse.json({ settings: data }); } catch { return NextResponse.json({ settings: null }); } }
export async function PATCH(request: Request) { const session = await getSessionCookie(); if (session?.role !== "admin") return NextResponse.json({ error: "Tidak memiliki akses." }, { status: 403 }); try { const payload = await request.json(); const db = getSupabaseAdmin() as any; const current = await db.from("website_settings").select("id").limit(1).maybeSingle(); const query = current.data ? db.from("website_settings").update(payload).eq("id", current.data.id) : db.from("website_settings").insert(payload); const { data, error } = await query.select().single(); if (error) throw error; return NextResponse.json({ settings: data }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menyimpan." }, { status: 500 }); } }
