import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import RoleGuard from "@/components/RoleGuard";
import VillageProfileForm from "@/components/VillageProfileForm";

export default function VillageProfilePage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardLayout>
        <AdminPageHeader
          eyebrow="Website"
          title="Profil Desa"
          description="Kelola profil desa yang ditampilkan pada website."
        />

        <VillageProfileForm />
      </DashboardLayout>
    </RoleGuard>
  );
}