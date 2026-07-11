import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import DashboardStats from "@/components/DashboardStats";
export default function DashboardPage() { return <DashboardLayout><AdminPageHeader eyebrow="Ringkasan" title="Selamat datang di CMS Desa" description="Pantau data informasi publik Desa Glagaharum secara langsung." /><DashboardStats /></DashboardLayout>; }
