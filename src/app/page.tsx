import Link from "next/link";
import PublicSiteShell from "@/components/PublicSiteShell";
import HeroSlider from "@/components/HeroSlider";
import PublicPotensiDesa from "@/components/PublicPotensiDesa";
import {
  PublicFeaturedUmkm,
  PublicLatestNews,
  PublicMetrics,
} from "@/components/PublicDataViews";

export default function HomePage() {
  return (
    <PublicSiteShell>
      <main>
        {/* Hero */}
        <HeroSlider />

        {/* Potensi Desa */}
        <section className="container section">
          <div className="section-heading">
            <span className="eyebrow">Potensi Desa</span>

            <h2>Menguatkan potensi dari akar lokal</h2>

            <p>
              Desa bergerak dengan semangat gotong royong,
              ekonomi kreatif, dan keterbukaan informasi.
            </p>
          </div>

          <PublicPotensiDesa />
        </section>

        {/* Statistik */}
        <section className="metrics-section">
          <div className="container metrics-grid">
            <PublicMetrics />
          </div>
        </section>

        {/* UMKM */}
        <section className="container section">
          <div className="section-row">
            <div className="section-heading">
              <span className="eyebrow">UMKM Unggulan</span>

              <h2>Belanja dari tetangga sendiri</h2>
            </div>

            <Link href="/umkm" className="text-link">
              Lihat semua UMKM
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          <PublicFeaturedUmkm limit={3} />
        </section>

        {/* Berita */}
        <section className="soft-section">
          <div className="container section">
            <div className="section-row">
              <div className="section-heading">
                <span className="eyebrow">Berita Terbaru</span>

                <h2>Kabar dari desa</h2>
              </div>

              <Link href="/berita" className="text-link">
                Semua berita
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <PublicLatestNews limit={3} />
          </div>
        </section>

        {/* Peta */}
        <section className="container section">
          <div className="map-banner">
            <div>
              <span className="eyebrow">
                Peta Digital Desa
              </span>

              <h2>Temukan lokasi penting dengan mudah</h2>

              <p>
                Kantor desa, fasilitas umum, tempat ibadah,
                sekolah, BUMDes, hingga UMKM dalam satu peta
                digital.
              </p>

              <Link
                href="/kontak"
                className="button primary"
              >
                Lihat titik lokasi
              </Link>
            </div>

            <i className="fa-solid fa-map-location-dot" />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}