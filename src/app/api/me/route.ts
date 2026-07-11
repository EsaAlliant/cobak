import { NextResponse } from "next/server";
import { getActiveProfileSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const context = await getActiveProfileSession();
    if (!context) return NextResponse.json({ ok: false, session: null }, { status: 401 });
    return NextResponse.json({ ok: true, session: context.session });
  } catch (error) { return NextResponse.json({ ok: false, session: null, error: error instanceof Error ? error.message : "Gagal memeriksa sesi." }, { status: 500 }); }
}
