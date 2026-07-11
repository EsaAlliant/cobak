"use client";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function UmkmModal({
  show,
  onClose,
}: Props) {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,.5)",
      }}
    >
      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h5>Tambah UMKM</h5>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            <div className="mb-3">

              <label className="form-label">
                Nama UMKM
              </label>

              <input
                className="form-control"
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Nama Pemilik
              </label>

              <input
                className="form-control"
              />

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>

            <button className="btn btn-success">
              Simpan
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}