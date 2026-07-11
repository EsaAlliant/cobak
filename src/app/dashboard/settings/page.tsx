import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import WebsiteSettingsForm from "@/components/WebsiteSettingsForm";
import RoleGuard from "@/components/RoleGuard";
export default function SettingsPage() { return <RoleGuard allowedRoles={["admin"]}><DashboardLayout><AdminPageHeader eyebrow="Pengaturan" title="Identitas website" description="Atur nama, logo, alamat, kontak, footer, dan SEO dasar website desa." /><WebsiteSettingsForm /></DashboardLayout></RoleGuard>; }
