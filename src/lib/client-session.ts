"use client";

import type { SessionPayload } from "@/lib/session";

const SESSION_STORAGE_KEY = "kt_session_cache";

type MeResponse =
  | { ok: true; session: SessionPayload }
  | { ok: false; session: null; error?: string };

let cachedSession: SessionPayload | null | undefined;
let cachedPromise: Promise<SessionPayload | null> | null = null;

function readStoredSession(): SessionPayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SessionPayload;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.expiresAt !== "number" || Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(session: SessionPayload | null) {
  if (typeof window === "undefined") return;

  try {
    if (!session) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors (private mode / disabled storage).
  }
}

export function setClientSessionCache(session: SessionPayload | null) {
  cachedSession = session;
  writeStoredSession(session);
}

export function clearClientSessionCache() {
  cachedSession = undefined;
  cachedPromise = null;
  writeStoredSession(null);
}

export async function getClientSession(forceRefresh = false): Promise<SessionPayload | null> {
  if (!forceRefresh) {
    if (cachedSession !== undefined) return cachedSession;

    const stored = readStoredSession();
    if (stored) {
      cachedSession = stored;
      return stored;
    }

    if (cachedPromise) return cachedPromise;
  }

  cachedPromise = fetch("/api/me", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as MeResponse;
      const session = data.ok ? data.session : null;
      if (session) {
        cachedSession = session;
        writeStoredSession(session);
      }
      return session;
    })
    .catch(() => null)
    .finally(() => {
      cachedPromise = null;
    });

  cachedSession = await cachedPromise;
  return cachedSession;
}
