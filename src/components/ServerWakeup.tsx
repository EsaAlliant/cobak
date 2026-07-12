"use client";

import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

export default function ServerWakeup({
  loading,
}: {
  loading: boolean;
}) {
  const opened = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      timer = setTimeout(() => {
        if (opened.current) return;

        opened.current = true;

        Swal.fire({
          icon: "info",
          title: "🏡 Desa Glagaharum",
          html: `
            <div style="line-height:1.7">
              <strong>⏳ Sedang Menghubungkan ke Server</strong>

              <br><br>

              Website sedang mempersiapkan data desa.

              <br><br>

              Server database sedang aktif kembali
              setelah periode tidak digunakan.

              <br><br>

              <strong>Estimasi waktu:</strong>
              30–60 detik.

              <br><br>

              Mohon jangan menutup halaman ini.
            </div>
          `,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }, 8000);
    } else {
      Swal.close();
      opened.current = false;
    }

    return () => clearTimeout(timer);
  }, [loading]);

  return null;
}