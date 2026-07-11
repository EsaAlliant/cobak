import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              <i className="fa-solid fa-triangle-exclamation fs-1 text-warning mb-3" />
              <h1 className="h3">Akses ditolak</h1>
              <p className="text-muted mb-4">
                Role kamu tidak memiliki izin untuk membuka halaman ini.
              </p>
              <Link href="/dashboard" className="btn btn-primary">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
