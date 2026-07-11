import type { ReactNode } from "react";

export default function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="admin-page-header"><div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}
