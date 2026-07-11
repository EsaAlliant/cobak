import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { getSessionCookie } from "@/lib/admin-auth";


export const metadata: Metadata = {
  title: "CMS Desa Glagaharum | Transformasi Digital Desa",
  description: "Portal informasi resmi dan CMS Desa Glagaharum.",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeSession = await getSessionCookie();

  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider session={activeSession} loading={false}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
