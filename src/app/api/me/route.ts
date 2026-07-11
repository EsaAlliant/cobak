import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await decodeSession(raw);

    if (!session || (session.expiresAt && Date.now() > session.expiresAt)) {
      return NextResponse.json({ ok: false, session: null }, { status: 401 });
    }

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    return NextResponse.json(
      { ok: false, session: null, error: error instanceof Error ? error.message : "Gagal membaca session" },
      { status: 500 }
    );
  }
}
