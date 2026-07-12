import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import RoleGuard from "@/components/RoleGuard";
import UmkmWorkspace from "@/components/UmkmWorkspace";

export default function UmkmDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardLayout>
        <AdminPageHeader
          eyebrow="UMKM Desa"
          title="Kelola UMKM"
          description="Tambah, ubah, hapus, dan publikasikan data UMKM beserta kategori, produk, foto, logo, lokasi usaha, kontak, dan tautan marketplace."
        />

        <UmkmWorkspace />
      </DashboardLayout>
    </RoleGuard>
  );
}