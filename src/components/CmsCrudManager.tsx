"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Value = string | boolean;
type Values = Record<string, Value>;
export type CrudField = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "datetime-local"
    | "checkbox"
    | "url"
    | "password"
    | "select";

  required?: boolean;

  upload?: "website" | "gallery" | "news" | "umkm" | "branding";

  placeholder?: string;

  relation?: {
    resource: string;
    labelField: string;
    valueField?: string;
  };
};
export default function CmsCrudManager({ resource, title, fields, emptyText }: { resource: string; title: string; fields: CrudField[]; emptyText: string }) {
  const [rows, setRows] = useState<Values[]>([]);
  const [editing, setEditing] = useState<Values | null>(null);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [relations, setRelations] = useState<
    Record<string, { label: string; value: string }[]>
  >({});
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<Values>();
  const endpoint = `/api/${resource}`;

  const list = async () => { const response = await fetch(endpoint); const body = await response.json(); if (response.ok) setRows(body.data || []); else setMessage(body.error || "Gagal memuat data."); };
  useEffect(() => { void list(); }, []);
  useEffect(() => {
  async function loadRelations() {
    const result: Record<string, { label: string; value: string }[]> = {};

    for (const field of fields) {
      if (!field.relation) continue;

      const response = await fetch(`/api/${field.relation.resource}`);
      const body = await response.json();

      result[field.key] = (body.data || []).map((item: Record<string, unknown>) => ({
        label: String(item[field.relation!.labelField] ?? ""),
        value: String(item[field.relation!.valueField ?? "id"] ?? ""),
      }));
    }

    setRelations(result);
  }

  void loadRelations();
}, [fields]);

  
  const newRecord = () => { setEditing(null); setFiles({}); reset(Object.fromEntries(fields.map((field) => [field.key, field.type === "checkbox" ? true : ""]))); setMessage(""); setOpen(true); };
  const editRecord = (row: Values) => { setEditing(row); setFiles({}); reset(Object.fromEntries(fields.map((field) => [field.key, row[field.key] ?? (field.type === "checkbox" ? true : "")] ))); setMessage(""); setOpen(true); };
  const validation = useMemo(() => fields.filter((field) => field.required), [fields]);

  const onSubmit = async (values: Values) => {
    for (const field of validation.filter((field) => !(editing && field.key === "password"))) {
      const result = z.string().trim().min(2, `${field.label} wajib diisi.`).safeParse(values[field.key]);
      if (!result.success) { setMessage(result.error.issues[0].message); return; }
    }
    const payload: Values = Object.fromEntries(
      Object.entries(values).filter(([, value]) => typeof value !== "string" || value.trim() !== "")
    ) as Values;
    for (const field of fields.filter((item) => item.upload)) {
      const file = files[field.key];
      if (!file || !field.upload) continue;
      const uploadData = new FormData(); uploadData.set("file", file); uploadData.set("bucket", field.upload);
      const upload = await fetch("/api/upload", { method: "POST", body: uploadData }); const uploadBody = await upload.json();
      if (!upload.ok) { setMessage(uploadBody.error || "Upload gagal."); return; }
      payload[field.key] = uploadBody.url;
    }
    const response = await fetch(editing ? `${endpoint}/${editing.id}` : endpoint, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) { setMessage(body.error || "Gagal menyimpan data."); return; }
    setOpen(false); await list();
  };

  const remove = async (id: string) => { if (!window.confirm("Hapus data ini?")) return; const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" }); if (!response.ok) { const body = await response.json(); setMessage(body.error || "Gagal menghapus data."); return; } await list(); };

  return <section className="admin-table-card cms-manager"><div className="cms-manager-head"><div><h3>{title}</h3><p>{rows.length} data tercatat</p></div><button className="button primary" onClick={newRecord}><i className="fa-solid fa-plus" /> Tambah</button></div>{message && !open ? <p className="cms-error">{message}</p> : null}<div className="table-responsive"><table className="table align-middle"><thead><tr>{fields.slice(0, 4).map((field) => <th key={field.key}>{field.label}</th>)}<th>Aksi</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={String(row.id)}>{fields.slice(0, 4).map((field) => <td key={field.key}>{field.type === "checkbox" ? (row[field.key] ? "Aktif" : "Nonaktif") : field.type === "password" ? "••••••" : String(row[field.key] || "-").slice(0, 80)}</td>)}<td className="table-actions"><button type="button" className="action-btn edit" onClick={() => editRecord(row)}><i className="fa-solid fa-pen" /> Edit</button><button type="button" className="action-btn delete" onClick={() => void remove(String(row.id))}><i className="fa-solid fa-trash" /> Hapus</button></td></tr>) : <tr><td colSpan={fields.slice(0, 4).length + 1} className="text-center py-5 text-muted">{emptyText}</td></tr>}</tbody></table></div>{open ? <div className="cms-modal-backdrop"><form className="cms-modal" onSubmit={handleSubmit(onSubmit)}><div className="cms-manager-head"><h3>{editing ? "Ubah" : "Tambah"} {title}</h3><button type="button" className="btn-close" onClick={() => setOpen(false)} /></div>{message ? <p className="cms-error">{message}</p> : null}<div className="cms-form-grid">{fields.map((field) => <label key={field.key} className={field.type === "textarea" ? "wide" : ""}>{field.label}{field.type === "checkbox" ? 
  <input type="checkbox" {...register(field.key)} />
: field.type === "textarea"
? <textarea placeholder={field.placeholder} {...register(field.key)} />
: field.type === "select"
? (
    <select {...register(field.key)}>
      <option value="">Pilih {field.label}</option>

      {(relations[field.key] || []).map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
: <>
    <input
      type={
        field.type === "datetime-local"
          ? "datetime-local"
          : field.type === "url"
          ? "url"
          : field.type === "password"
          ? "password"
          : "text"
      }
      placeholder={field.placeholder}
      {...register(field.key)}
    />

    {field.upload ? (
      <span className="upload-field">
        <span className="upload-preview">
          {(() => {
            const currentFile = files[field.key];
            const currentUrl = currentFile ? URL.createObjectURL(currentFile) : (watch(field.key) as string | undefined);
            return currentUrl ? <img src={currentUrl} alt="" /> : <i className="fa-solid fa-image" />;
          })()}
        </span>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(event) =>
            setFiles((current) => ({
              ...current,
              [field.key]: event.target.files?.[0] || null,
            }))
          }
        />
      </span>
    ) : null}
  </>
  }</label>)}</div><div className="cms-modal-actions"><button type="button" className="button secondary" onClick={() => setOpen(false)}>Batal</button><button className="button primary" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan"}</button></div></form></div> : null}</section>;
}
