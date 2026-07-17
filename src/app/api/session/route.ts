import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE_NAME,
  type SessionPayload,
} from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_MONTH = 60 * 60 * 24 * 30;

type ProfileRow = {
  id: string;
  name: string;
  role: SessionPayload["role"];
  is_active?: boolean | null;
  avatar_url?: string | null;
};

type SessionRequest = {
  // Token akses Supabase Auth yang didapat DI KLIEN sesaat setelah
  // signInWithPassword berhasil. Ini yang jadi bukti identitas -- bukan
  // field-field lain yang bisa dikarang bebas oleh siapa pun yang memanggil
  // endpoint ini langsung (curl/Postman/dst).
  access_token?: string;
  remember?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SessionRequest;

  if (!body.access_token) {
    return NextResponse.json({ ok: false, error: "Token akses diperlukan." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  // Verifikasi token langsung ke Supabase Auth -- ini membuktikan pemanggil
  // benar-benar baru saja login dengan email/password yang valid. Token yang
  // dikarang atau kadaluarsa akan ditolak Supabase sendiri.
  const { data: userData, error: userError } = await admin.auth.getUser(body.access_token);
  if (userError || !userData.user) {
    return NextResponse.json({ ok: false, error: "Token akses tidak valid atau kedaluwarsa." }, { status: 401 });
  }

  // Role & status akun SELALU diambil dari database, tidak pernah dari input
  // client, supaya orang tidak bisa "minta" role admin lewat body request.
  const { data: profile, error: profileError } = await admin
    .from("users")
    .select("id,name,role,is_active,avatar_url")
    .eq("id", userData.user.id)
    .single<ProfileRow>();

  if (profileError || !profile || profile.is_active === false) {
    return NextResponse.json({ ok: false, error: "Akun tidak ditemukan atau dinonaktifkan." }, { status: 403 });
  }

  const maxAge = body.remember ? ONE_MONTH : ONE_WEEK;

  const payload: SessionPayload = {
    userId: profile.id,
    email: userData.user.email ?? "",
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url || undefined,
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

export async function PATCH() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const current = await decodeSession(raw);

    if (!current || (current.expiresAt && Date.now() > current.expiresAt)) {
      return NextResponse.json({ ok: false, error: "Session tidak ditemukan" }, { status: 401 });
    }

    // PATCH tidak lagi menerima field apa pun dari body request. Tujuannya
    // cuma "menyegarkan" cookie kalau data profil berubah di database --
    // jadi kita re-fetch langsung dari DB, bukan percaya klaim client
    // (dulu di sini client bisa kirim { role: "admin" } dan langsung diterima).
    const admin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("id,name,role,is_active,avatar_url")
      .eq("id", current.userId)
      .single<ProfileRow>();

    if (profileError || !profile || profile.is_active === false) {
      return NextResponse.json({ ok: false, error: "Akun tidak ditemukan atau dinonaktifkan." }, { status: 403 });
    }

    const payload: SessionPayload = {
      ...current,
      email: current.email,
      name: profile.name,
      role: profile.role,
      avatarUrl: profile.avatar_url || undefined,
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

