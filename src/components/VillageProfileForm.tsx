"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type Form = {
  village_name: string;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  sejarah: string;
  visi: string;
  misi: string;
};

export default function VillageProfileForm() {
  const [form, setForm] = useState<Form>({
    village_name: "",
    hero_title: "",
    hero_description: "",
    hero_image_url: "",
    sejarah: "",
    visi: "",
    misi: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState<File | null>(null);

  const heroImagePreview = useMemo(
    () => (heroImage ? URL.createObjectURL(heroImage) : form.hero_image_url),
    [heroImage, form.hero_image_url]
  );

  useEffect(() => {
    fetch("/api/village-profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setForm((current) => ({ ...current, ...data.profile }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);

    try {
      const payload = { ...form };

      if (heroImage) {
        const data = new FormData();
        data.set("file", heroImage);
        data.set("bucket", "website");
        const upload = await fetch("/api/upload", { method: "POST", body: data });
        const body = await upload.json();
        if (!upload.ok) throw new Error(body.error);
        payload.hero_image_url = body.url;
      }

      const res = await fetch("/api/village-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        Swal.fire("Error", body.error, "error");
        return;
      }

      setForm((current) => ({ ...current, hero_image_url: payload.hero_image_url }));
      setHeroImage(null);

      Swal.fire("Berhasil", "Profil desa berhasil disimpan", "success");
    } catch (cause) {
      Swal.fire("Error", cause instanceof Error ? cause.message : "Gagal menyimpan profil desa.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Memuat...</p>;

  return (
    <div className="settings-stack">
      <section className="settings-card">
        <h3>Banner Profil Desa</h3>

        <div className="settings-form">
          <label className="settings-full">
            Gambar Banner
            <span className="upload-field">
              <span className="upload-preview is-wide">
                {heroImagePreview ? <img src={heroImagePreview} alt="Pratinjau banner" /> : <i className="fa-solid fa-image" />}
              </span>
              <input type="file" accept="image/*" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} />
            </span>
          </label>

          <label>
            Nama Desa
            <input
              value={form.village_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  village_name: e.target.value,
                })
              }
            />
          </label>

          <label>
            Judul Banner
            <input
              value={form.hero_title}
              onChange={(e) =>
                setForm({
                  ...form,
                  hero_title: e.target.value,
                })
              }
            />
          </label>

          <label className="settings-full">
            Deskripsi Banner
            <textarea
              value={form.hero_description}
              onChange={(e) =>
                setForm({
                  ...form,
                  hero_description: e.target.value,
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="settings-card">
        <h3>Profil Desa</h3>

        <div className="settings-form">
          <label className="settings-full">
            Sejarah
            <textarea
              rows={8}
              value={form.sejarah}
              onChange={(e) =>
                setForm({
                  ...form,
                  sejarah: e.target.value,
                })
              }
            />
          </label>

          <label className="settings-full">
            Visi
            <textarea
              rows={5}
              value={form.visi}
              onChange={(e) =>
                setForm({
                  ...form,
                  visi: e.target.value,
                })
              }
            />
          </label>

          <label className="settings-full">
            Misi <small>(satu baris untuk satu poin)</small>
            <textarea
              rows={8}
              value={form.misi}
              onChange={(e) =>
                setForm({
                  ...form,
                  misi: e.target.value,
                })
              }
            />
          </label>
        </div>
      </section>

      <p className="cms-hint">
        Untuk mengatur susunan pengurus (foto, nama, jabatan), buka tab <strong>Struktur Organisasi</strong>.
      </p>

      <button className="button primary settings-save" onClick={save} disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}
