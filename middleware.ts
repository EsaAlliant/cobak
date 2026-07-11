import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/session";
import { ROLE_REQUIREMENTS } from "@/lib/roles";

function isProtectedPath(pathname: string) {
  return Object.keys(ROLE_REQUIREMENTS).some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

function getBasePath(pathname: string) {
  const keys = Object.keys(ROLE_REQUIREMENTS).sort((a, b) => b.length - a.length);
  return keys.find((base) => pathname === base || pathname.startsWith(`${base}/`)) ?? "";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSession(raw);

  if (!session || (session.expiresAt && Date.now() > session.expiresAt)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const base = getBasePath(pathname);
  const allowedRoles = ROLE_REQUIREMENTS[base] ?? [];
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
