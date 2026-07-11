import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
const fields = ["Nama Website", "Logo Website", "Alamat", "Nomor Telepon", "Email", "Media Sosial Desa", "Footer", "SEO sederhana"];
export default function SettingsPage() { return <DashboardLayout><AdminPageHeader eyebrow="Pengaturan" title="Identitas website" description="Atur informasi utama yang tampil pada website publik Desa Glagaharum." /><section className="settings-card">{fields.map((field) => <div key={field}><i className="fa-solid fa-circle-check" /><span>{field}</span><button aria-label={`Atur ${field}`}>Atur <i className="fa-solid fa-arrow-right" /></button></div>)}</section></DashboardLayout>; }
