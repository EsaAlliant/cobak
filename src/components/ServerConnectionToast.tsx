"use client";

import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

type Props = {
  loading: boolean;
};

const SESSION_KEY = "server-toast-shown";

export default function ServerConnectionToast({
  loading,
}: Props) {
  const shown = useRef(false);

  useEffect(() => {
    let infoTimer: ReturnType<typeof setTimeout> | undefined;
    let slowTimer: ReturnType<typeof setTimeout> | undefined;
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined;

    if (loading) {
      if (sessionStorage.getItem(SESSION_KEY)) {
        return;
      }

      infoTimer = setTimeout(() => {
        if (shown.current) return;

        shown.current = true;

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "🏡 Desa Glagaharum",
          html: `
            <strong>
              <i class="fa-solid fa-spinner fa-spin"></i>
              Sedang Menyiapkan Layanan
            </strong>

            <br><br>

            Website sedang memuat data desa.

            <br><br>

            Server database sedang aktif kembali
            setelah beberapa waktu tidak digunakan.

            <br><br>

            Mohon tunggu sebentar...
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: undefined,
        });
      }, 5000);

      slowTimer = setTimeout(() => {
        if (!shown.current) return;

        Swal.update({
          icon: "warning",
          html: `
            <strong>
              <i class="fa-solid fa-spinner fa-spin"></i>
              Proses Sedikit Lebih Lama
            </strong>

            <br><br>

            Database sedang aktif kembali.

            <br><br>

            Mohon tunggu beberapa saat lagi.
          `,
        });
      }, 15000);

      timeoutTimer = setTimeout(() => {
        if (!shown.current) return;

        Swal.update({
          icon: "error",
          html: `
            <strong>Server membutuhkan waktu lebih lama.</strong>

            <br><br>

            Silakan tekan tombol di bawah untuk mencoba kembali.
          `,
          showConfirmButton: true,
          confirmButtonText: "🔄 Coba Lagi",
        });

        Swal.getConfirmButton()?.addEventListener(
          "click",
          () => window.location.reload(),
          { once: true }
        );
      }, 60000);
    } else {
      if (infoTimer) clearTimeout(infoTimer);
      if (slowTimer) clearTimeout(slowTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);

      if (shown.current) {
        Swal.close();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🏡 Desa Glagaharum",
          text: "Berhasil terhubung ke server.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        sessionStorage.setItem(SESSION_KEY, "true");

        shown.current = false;
      }
    }

    return () => {
      if (infoTimer) clearTimeout(infoTimer);
      if (slowTimer) clearTimeout(slowTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
  }, [loading]);

  return null;
}