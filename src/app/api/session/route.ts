import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE_NAME,
  type SessionPayload,
} from "@/lib/session";

const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_MONTH = 60 * 60 * 24 * 30;

type SessionRequest = SessionPayload & {
  remember?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SessionRequest;
  const maxAge = body.remember ? ONE_MONTH : ONE_WEEK;

  const payload: SessionPayload = {
    userId: body.userId,
    email: body.email,
    name: body.name,
    role: body.role,
    avatarUrl: body.avatarUrl,
    expiresAt: Date.now() + maxAge * 1000,
  };

  const response = NextResponse.json({ ok: true, session: payload });
  response.cookies.set(SESSION_COOKIE_NAME, await encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  return response;
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const current = await decodeSession(raw);

    if (!current || (current.expiresAt && Date.now() > current.expiresAt)) {
      return NextResponse.json({ ok: false, error: "Session tidak ditemukan" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Pick<SessionPayload, "email" | "name" | "role" | "avatarUrl">>;

    const payload: SessionPayload = {
      ...current,
      email: body.email ?? current.email,
      name: body.name ?? current.name,
      role: (body.role ?? current.role) as SessionPayload["role"],
      avatarUrl: body.avatarUrl ?? current.avatarUrl,
    };

    const response = NextResponse.json({ ok: true, session: payload });
    const maxAge = Math.max(60, Math.floor((payload.expiresAt - Date.now()) / 1000));

    response.cookies.set(SESSION_COOKIE_NAME, await encodeSession(payload), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Gagal memperbarui session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

