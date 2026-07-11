import PublicSiteShell from "@/components/PublicSiteShell"; import { PublicEvents } from "@/components/PublicDataViews";
export default function AgendaPage() { return <PublicSiteShell><main className="container page-section"><span className="eyebrow">Agenda Desa</span><h1>Jadwal kegiatan mendatang</h1><PublicEvents /></main></PublicSiteShell>; }
