import type { Metadata } from "next";
import Script from "next/script";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { getSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DEFAULT_TITLE = "CMS Desa Glagaharum | Transformasi Digital Desa";
const DEFAULT_DESCRIPTION = "Portal informasi resmi dan CMS Desa Glagaharum.";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSiteMeta() {
  try {
    const { data } = await (getSupabaseAdmin() as any)
      .from("website_settings")
      .select("nama_website, seo")
      .limit(1)
      .maybeSingle();
    return { namaWebsite: data?.nama_website as string | undefined, seo: (data?.seo || {}) as Record<string, string> };
  } catch {
    return { namaWebsite: undefined, seo: {} as Record<string, string> };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { namaWebsite, seo } = await getSiteMeta();
  const title = seo.title || (namaWebsite ? `${namaWebsite} | Portal Resmi Desa` : DEFAULT_TITLE);
  const description = seo.description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    openGraph: { title, description, images: seo.og_image ? [{ url: seo.og_image }] : undefined },
    verification: seo.search_console ? { google: seo.search_console } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeSession = await getSessionCookie();
  const { seo } = await getSiteMeta();

  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {seo.google_analytics ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.google_analytics}');`}
            </Script>
          </>
        ) : null}
        <AuthProvider session={activeSession} loading={false}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
