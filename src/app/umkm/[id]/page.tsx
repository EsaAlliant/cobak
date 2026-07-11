import PublicSiteShell from "@/components/PublicSiteShell"; import { PublicUmkmDetail } from "@/components/PublicDataViews";
export default async function UmkmDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PublicSiteShell><main className="container page-section"><PublicUmkmDetail id={id} /></main></PublicSiteShell>; }
