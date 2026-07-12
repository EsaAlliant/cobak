"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { profileSchema } from "@/lib/validators/users";
import { compressImage } from "@/lib/image-compression";

type Form = { name: string; email: string; phone: string; password: string; avatar_url: string };

export default function ProfileForm() {
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<Form>();
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const savedAvatarUrl = watch("avatar_url");
  const avatarPreview = useMemo(() => (avatar ? URL.createObjectURL(avatar) : savedAvatarUrl), [avatar, savedAvatarUrl]);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => body?.data && reset({ ...body.data, password: "", phone: body.data.phone || "", avatar_url: body.data.avatar_url || "" }))
      .catch(() => setError("Gagal memuat profil."));
  }, [reset]);

  const submit = async (values: Form) => {
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    if (avatar) {
      const data = new FormData();
      data.set("bucket", "branding");
      data.set("file", await compressImage(avatar));
      const upload = await fetch("/api/upload", { method: "POST", body: data });
      const body = await upload.json();
      if (!upload.ok) { setError(body.error); return; }
      values.avatar_url = body.url;
    }
    const response = await fetch("/api/users/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json();
    if (!response.ok) { setError(body.error); return; }
    await Swal.fire({ icon: "success", title: "Profil diperbarui", timer: 1200, showConfirmButton: false });
    window.location.reload();
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit(submit)}>
      {error && <p className="cms-error">{error}</p>}
      <label>Nama<input {...register("name")} /></label>
      <label>Email<input type="email" {...register("email")} /></label>
      <label>Telepon<input {...register("phone")} /></label>
      <label>Password Baru <small>(opsional)</small><input type="password" {...register("password")} /></label>
      <label>
        Foto Profil
        <span className="upload-field">
          <span className="upload-preview is-round">{avatarPreview ? <img src={avatarPreview} alt="Pratinjau foto profil" /> : <i className="fa-solid fa-user" />}</span>
          <input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
        </span>
      </label>
      <button className="button primary" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan Profil"}</button>
    </form>
  );
}
