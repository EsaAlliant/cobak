"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import AdminPageHeader from "@/components/AdminPageHeader";
import UmkmModal from "./components/UmkmModal";

type Umkm = {
  id: string;
  name: string;
  owner_name: string;
  whatsapp: string | null;
  logo_url: string | null;
  is_active: boolean;
};

export default function UmkmDataPage() {
    const [umkms, setUmkms] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
  loadUmkm();
}, []);

async function loadUmkm() {
  setLoading(true);

  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    setUmkms(data ?? []);
  }

  setLoading(false);
}
  return (
    <DashboardLayout>
      <AdminPageHeader
        eyebrow="UMKM"
        title="Data UMKM"
        description="Kelola seluruh data UMKM Desa."
      />

      <div className="card shadow-sm border-0">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h5 className="mb-1">
                Daftar UMKM
              </h5>

              <small className="text-muted">
                Total : 0 UMKM
              </small>

            </div>

            <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
            >

              <i className="fa-solid fa-plus me-2"></i>

              Tambah UMKM

            </button>

          </div>

          <div className="row mb-4">

            <div className="col-md-4">

              <input
                type="text"
                className="form-control"
                placeholder="Cari UMKM..."
              />

            </div>

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">

                <tr>

                  <th>Logo</th>

                  <th>Nama UMKM</th>

                  <th>Pemilik</th>

                  <th>WhatsApp</th>

                  <th>Status</th>

                  <th style={{ width: "180px" }}>
                    Aksi
                  </th>

                </tr>

              </thead>

              <tbody>

  {loading ? (

    <tr>

      <td colSpan={6} className="text-center py-5">

        <div
          className="spinner-border text-success mb-3"
          role="status"
        />

        <p className="mb-0">
          Memuat data...
        </p>

      </td>

    </tr>

  ) : umkms.length === 0 ? (

    <tr>

      <td
        colSpan={6}
        className="text-center py-5"
      >

        <i
          className="fa-solid fa-store text-secondary"
          style={{
            fontSize: 50,
          }}
        />

        <h5 className="mt-3">
          Belum Ada Data UMKM
        </h5>

        <p className="text-muted mb-0">
          Klik tombol
          <strong> Tambah UMKM </strong>
          untuk membuat data pertama.
        </p>

      </td>

    </tr>

  ) : (

    umkms.map((item) => (

      <tr key={item.id}>

        <td>

          {item.logo_url ? (

            <img
              src={item.logo_url}
              alt={item.name}
              width={50}
              height={50}
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

          ) : (

            <span className="text-muted">
              -
            </span>

          )}

        </td>

        <td>

          <strong>
            {item.name}
          </strong>

        </td>

        <td>

          {item.owner_name}

        </td>

        <td>

          {item.whatsapp ?? "-"}

        </td>

        <td>

          {item.is_active ? (

            <span className="badge bg-success">
              Aktif
            </span>

          ) : (

            <span className="badge bg-danger">
              Nonaktif
            </span>

          )}

        </td>

        <td>

          <button className="btn btn-warning btn-sm me-2">

            <i className="fa-solid fa-pen" />

          </button>

          <button className="btn btn-danger btn-sm">

            <i className="fa-solid fa-trash" />

          </button>

        </td>

      </tr>

    ))

  )}

</tbody>

            </table>

          </div>

        </div>

      </div>
    <UmkmModal
    show={showModal}
    onClose={() => setShowModal(false)}
    />
    </DashboardLayout>
  );
}