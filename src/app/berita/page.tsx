import PublicSiteShell from "@/components/PublicSiteShell"; import { PublicNews } from "@/components/PublicDataViews";
export default function BeritaPage() { return <PublicSiteShell><main className="container page-section"><span className="eyebrow">Berita Desa</span><h1>Informasi terkini untuk warga</h1><PublicNews /></main></PublicSiteShell>; }
