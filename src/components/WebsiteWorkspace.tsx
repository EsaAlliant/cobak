"use client";

import { useState } from "react";
import CmsCrudManager, { type CrudField } from "@/components/CmsCrudManager";
import VillageProfileForm from "@/components/VillageProfileForm";

const groups: Record<
  string,
  {
    label: string;
    resource: string;
    fields: CrudField[];
  }
> = {
  hero: {
    label: "Hero Slider",
    resource: "hero-slides",
    fields: [
      { key: "title", label: "Judul", required: true },
      { key: "subtitle", label: "Subjudul", type: "textarea" },
      {
        key: "image_url",
        label: "Gambar Slide",
        required: true,
        upload: "website",
      },
      {
        key: "cta_label",
        label: "Teks Tombol",
        placeholder: "Mengenal Desa",
      },
      {
        key: "cta_url",
        label: "Tautan Tombol",
        placeholder: "/profil",
      },
      {
        key: "sort_order",
        label: "Urutan",
        placeholder: "0",
      },
      {
        key: "is_published",
        label: "Tampilkan di Beranda",
        type: "checkbox",
      },
    ],
  },

  news: {
    label: "Berita",
    resource: "news",
    fields: [
      { key: "title", label: "Judul", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "excerpt", label: "Ringkasan", type: "textarea" },
      {
        key: "content",
        label: "Isi Berita",
        type: "textarea",
        required: true,
      },
      {
        key: "cover_url",
        label: "Foto Sampul",
        upload: "news",
      },
      {
        key: "is_published",
        label: "Publikasikan",
        type: "checkbox",
      },
    ],
  },

  events: {
    label: "Agenda",
    resource: "events",
    fields: [
      { key: "title", label: "Judul", required: true },
      {
        key: "starts_at",
        label: "Mulai",
        type: "datetime-local",
        required: true,
      },
      { key: "location", label: "Lokasi", required: true },
      {
        key: "description",
        label: "Deskripsi",
        type: "textarea",
      },
      {
        key: "cover_url",
        label: "Foto",
        upload: "website",
      },
      {
        key: "is_published",
        label: "Publikasikan",
        type: "checkbox",
      },
    ],
  },

  gallery: {
    label: "Galeri",
    resource: "gallery",
    fields: [
      { key: "title", label: "Judul", required: true },
      {
        key: "description",
        label: "Keterangan",
        type: "textarea",
      },
      {
        key: "image_url",
        label: "Gambar",
        required: true,
        upload: "gallery",
      },
      {
        key: "is_published",
        label: "Publikasikan",
        type: "checkbox",
      },
    ],
  },

  pages: {
    label: "Profil & Halaman",
    resource: "pages",
    fields: [
      { key: "title", label: "Judul", required: true },
      {
        key: "slug",
        label: "Slug",
        required: true,
        placeholder: "profil, visi, sejarah",
      },
      {
        key: "content",
        label: "Konten",
        type: "textarea",
        required: true,
      },
      {
        key: "is_published",
        label: "Publikasikan",
        type: "checkbox",
      },
    ],
  },

  struktur: {
    label: "Struktur Organisasi",
    resource: "struktur-organisasi",
    fields: [
      { key: "photo_url", label: "Foto", upload: "website" },
      { key: "name", label: "Nama", required: true },
      { key: "position", label: "Jabatan", required: true },
      { key: "sort_order", label: "Urutan", placeholder: "0" },
      { key: "is_published", label: "Tampilkan", type: "checkbox" },
    ],
  },

  villageProfile: {
    label: "Profil Desa",
    resource: "village-profile",
    fields: [],
  },

  potensi: {
    label: "Potensi Desa",
    resource: "potensi-desa",
    fields: [
        {
            key: "title",
            label: "Judul",
            required: true,
        },

        {
            key: "description",
            label: "Deskripsi",
            type: "textarea",
        },

        {
            key: "icon",
            label: "Icon FontAwesome",
            placeholder: "fa-seedling",
        },

        {
            key: "image_url",
            label: "Gambar",
            upload: "website",
        },

        {
            key: "sort_order",
            label: "Urutan",
        },

        {
            key: "is_published",
            label: "Publikasikan",
            type: "checkbox",
        },
    ],
},
};

export default function WebsiteWorkspace() {
  const [tab, setTab] = useState<keyof typeof groups>("hero");

  const item = groups[tab];

  return (
    <>
      <div className="cms-tabs">
        {Object.entries(groups).map(([key, group]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key as keyof typeof groups)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {tab === "villageProfile" ? (
        <VillageProfileForm />
      ) : (
        <CmsCrudManager
          key={item.resource}
          resource={item.resource}
          title={item.label}
          fields={item.fields}
          emptyText={`Belum ada ${item.label.toLowerCase()}.`}
        />
      )}
    </>
  );
}