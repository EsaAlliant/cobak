import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE_NAME, type SessionPayload } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ProfileRow = {
  id: string;
  name: string;
  role: string;
  is_active?: boolean | null;
  avatar_url?: string | null;
};

export async function getSessionCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSession(raw);
  if (!session) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) return null;
  return session;
}

export async function getActiveProfileSession() {
  const session = await getSessionCookie();
  if (!session) return null;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("users")
    .select("id,name,role,is_active,avatar_url")
    .eq("id", session.userId)
    .single<ProfileRow>();

  if (error || !data || data.is_active === false) {
    return null;
  }

  return {
    session: {
      ...session,
      name: data.name ?? session.name,
      role: (data.role as SessionPayload["role"]) ?? session.role,
      avatarUrl: data.avatar_url ?? session.avatarUrl,
    },
    profile: data,
  };
}

export async function getActiveAdminSession() {
  const context = await getActiveProfileSession();
  if (!context) return null;
  if (context.profile.role !== "admin") return null;
  return context;
}
