import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import CmsCrudManager from "@/components/CmsCrudManager";
export default function DashboardGalleryPage() { return <DashboardLayout><AdminPageHeader eyebrow="Galeri" title="Kelola galeri desa" description="Unggah, ubah, atau hapus dokumentasi kegiatan desa." /><CmsCrudManager resource="gallery" title="Galeri" emptyText="Belum ada foto galeri." fields={[{ key: "title", label: "Judul", required: true }, { key: "description", label: "Keterangan", type: "textarea" }, { key: "image_url", label: "Gambar", required: true, upload: "gallery" }, { key: "is_published", label: "Publikasikan", type: "checkbox" }]} /></DashboardLayout>; }
