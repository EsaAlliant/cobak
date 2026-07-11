"use client";

import { useState } from "react";
import CmsCrudManager, { type CrudField } from "@/components/CmsCrudManager";

const groups: Record<
  string,
  {
    label: string;
    resource: string;
    fields: CrudField[];
  }
> = {
  umkm: {
    label: "Data UMKM",
    resource: "umkm",
    fields: [
      { key: "name", label: "Nama UMKM", required: true },
      { key: "owner_name", label: "Nama Pemilik", required: true },
      {
        key: "category_id",
        label: "Kategori",
        type: "select",
        relation: {
          resource: "categories",
          labelField: "name",
          valueField: "id",
        },
      },
      { key: "address", label: "Alamat", type: "textarea" },
      { key: "whatsapp", label: "WhatsApp", required: true },
      { key: "maps_url", label: "Google Maps", type: "url" },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "photo_url", label: "Foto Utama", upload: "umkm" },
      { key: "logo_url", label: "Logo", upload: "branding" },
      { key: "instagram", label: "Instagram", type: "url" },
      { key: "facebook", label: "Facebook", type: "url" },
      { key: "tiktok", label: "TikTok", type: "url" },
      { key: "shopee", label: "Shopee", type: "url" },
      { key: "tokopedia", label: "Tokopedia", type: "url" },
      { key: "website", label: "Website", type: "url" },
      { key: "is_active", label: "Status Aktif", type: "checkbox" },
    ],
  },

  categories: {
    label: "Kategori",
    resource: "categories",
    fields: [
      { key: "name", label: "Nama Kategori", required: true },
      { key: "slug", label: "Slug", required: true },
      {
        key: "type",
        label: "Tipe",
        required: true,
        placeholder: "umkm",
      },
    ],
  },

  products: {
    label: "Produk",
    resource: "umkm-products",
    fields: [
      {
        key: "umkm_id",
        label: "UMKM",
        type: "select",
        required: true,
        relation: {
          resource: "umkm",
          labelField: "name",
          valueField: "id",
        },
      },
      { key: "name", label: "Nama Produk", required: true },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "price", label: "Harga" },
      { key: "photo_url", label: "Foto Produk", upload: "umkm" },
      { key: "is_active", label: "Status Aktif", type: "checkbox" },
    ],
  },

  
};

export default function UmkmWorkspace() {
  const [tab, setTab] = useState("umkm");
  const item = groups[tab];

  return (
    <>
      <div className="cms-tabs">
        {Object.entries(groups).map(([key, group]) => (
          <button
            key={key}
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <CmsCrudManager
        key={item.resource}
        resource={item.resource}
        title={item.label}
        fields={item.fields}
        emptyText={`Belum ada ${item.label.toLowerCase()}.`}
      />
    </>
  );
}