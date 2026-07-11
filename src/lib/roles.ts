export type UserRole = "admin" | "operator";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  operator: "Operator",
};

export const ROLE_ORDER: UserRole[] = ["admin", "operator"];

export type MenuItem = { href: string; label: string; icon: string };

export const ROLE_MENUS: Record<UserRole, MenuItem[]> = {
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
    { href: "/dashboard/profile", label: "Profil Saya", icon: "fa-user" },
    { href: "/dashboard/website", label: "Website", icon: "fa-globe" },
    { href: "/dashboard/umkm", label: "UMKM", icon: "fa-store" },
    { href: "/dashboard/users", label: "Pengguna", icon: "fa-users-gear" },
    { href: "/dashboard/settings", label: "Pengaturan", icon: "fa-gear" },
  ],
  operator: [
    { href: "/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
    { href: "/dashboard/profile", label: "Profil Saya", icon: "fa-user" },
    { href: "/dashboard/umkm", label: "UMKM", icon: "fa-store" },
    { href: "/dashboard/gallery", label: "Galeri", icon: "fa-images" },
  ],
};

export const ROLE_REQUIREMENTS: Record<string, UserRole[]> = {
  "/dashboard": ROLE_ORDER,
  "/dashboard/profile": ROLE_ORDER,
  "/dashboard/website": ["admin"],
  "/dashboard/umkm": ROLE_ORDER,
  "/dashboard/gallery": ROLE_ORDER,
  "/dashboard/users": ["admin"],
  "/dashboard/settings": ["admin"],
};
