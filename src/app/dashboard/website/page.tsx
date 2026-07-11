import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import WebsiteWorkspace from "@/components/WebsiteWorkspace";
import RoleGuard from "@/components/RoleGuard";
export default function WebsiteDashboardPage() { return <RoleGuard allowedRoles={["admin"]}><DashboardLayout><AdminPageHeader eyebrow="Website" title="Kelola konten website" description="Tambah, ubah, hapus, publikasikan, dan unggah konten website desa." /><WebsiteWorkspace /></DashboardLayout></RoleGuard>; }
