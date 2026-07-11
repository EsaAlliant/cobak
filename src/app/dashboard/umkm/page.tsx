import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";

const umkmMenus = [
  {
    title: "Data UMKM",
    description: "Direktori usaha dan profil pemilik",
    icon: "fa-store",
    href: "/dashboard/umkm/data",
  },
  {
    title: "Kategori",
    description: "Klasifikasi kuliner, kerajinan, pertanian, dan lainnya",
    icon: "fa-tags",
    href: "/dashboard/umkm/kategori",
  },
  {
    title: "Produk",
    description: "Daftar produk unggulan UMKM",
    icon: "fa-box-open",
    href: "/dashboard/umkm/produk",
  },
  {
    title: "Branding",
    description: "Logo, banner, poster, foto, dan katalog",
    icon: "fa-wand-magic-sparkles",
    href: "/dashboard/umkm/branding",
  },
  {
    title: "Marketplace",
    description: "Tautan Shopee, Tokopedia, dan kanal penjualan",
    icon: "fa-bag-shopping",
    href: "/dashboard/umkm/marketplace",
  },
];

export default function UmkmDashboardPage() {
  return (
    <DashboardLayout>
      <AdminPageHeader
        eyebrow="Digitalisasi UMKM"
        title="Pusat UMKM Desa"
        description="Kelola etalase usaha warga agar mudah ditemukan dan dihubungi."
        action={
          <button className="button primary">
            <i className="fa-solid fa-plus me-2"></i>
            Tambah UMKM
          </button>
        }
      />

      <div className="module-grid">
        {umkmMenus.map((menu) => (
          <article key={menu.title} className="module-card">
            <span className="module-icon">
              <i className={`fa-solid ${menu.icon}`} />
            </span>

            <h2>{menu.title}</h2>

            <p>{menu.description}</p>

            <Link href={menu.href} className="button ghost">
              Kelola
              <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}