import type { UserRole } from "@/lib/roles";

export const SESSION_COOKIE_NAME = "desa_glagaharum_session";

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
};

export type SessionPayload = SessionUser & {
  expiresAt: number;
};

const FALLBACK_SESSION_SECRET = "desa-glagaharum-dev-session-secret-change-me";
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || FALLBACK_SESSION_SECRET;

let cachedKey: CryptoKey | null = null;
let cachedKeyPromise: Promise<CryptoKey> | null = null;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return result === 0;
}

async function getSigningKey() {
  if (cachedKey) return cachedKey;
  if (!cachedKeyPromise) {
    const encoder = new TextEncoder();
    cachedKeyPromise = crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  }

  cachedKey = await cachedKeyPromise;
  return cachedKey;
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function encodeSession(payload: SessionPayload) {
  const encodedPayload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function decodeSession(raw?: string | null): Promise<SessionPayload | null> {
  if (!raw) return null;
  try {
    const [payload, signature] = raw.split(".");
    if (payload && signature) {
      const expected = await sign(payload);
      if (!timingSafeEqual(signature, expected)) return null;
      return JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as SessionPayload;
    }

    return JSON.parse(decodeURIComponent(raw)) as SessionPayload;
  } catch {
    return null;
  }
}
