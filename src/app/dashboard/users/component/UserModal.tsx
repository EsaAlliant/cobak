"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  role: z.enum(["admin", "operator"]),
});

type UserForm = z.infer<typeof userSchema>;

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator";
  is_active: boolean;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData | null;
};

export default function UserModal({
  show,
  onClose,
  onSuccess,
  user,
}: Props) {
  const isEdit = !!user;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "operator",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "operator",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: UserForm) => {
  try {
    setLoading(true);

    const url = isEdit
      ? `/api/users/${user?.id}`
      : "/api/users";

    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Terjadi kesalahan.");
    }

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: isEdit
        ? "Pengguna berhasil diperbarui."
        : "Pengguna berhasil ditambahkan.",
      timer: 1500,
      showConfirmButton: false,
    });

    reset();

    onClose();

    onSuccess();

  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.message,
    });
  } finally {
    setLoading(false);
  }
};
  if (!show) return null;
    return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                <i className={`fa-solid ${isEdit ? "fa-user-pen" : "fa-user-plus"} me-2`} />
                {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
              </h5>

              <button
                type="button"
                className="btn-close"
                disabled={loading}
                onClick={onClose}
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label">
                      Nama
                    </label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      {...register("name")}
                    />

                    <div className="invalid-feedback">
                      {errors.name?.message}
                    </div>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email")}
                      disabled={isEdit}
                    />

                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>

                  </div>

                  {!isEdit && (

                    <div className="col-md-6">

                      <label className="form-label">
                        Password
                      </label>

                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        {...register("password")}
                      />

                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>

                    </div>

                  )}

                  <div className="col-md-6">

                    <label className="form-label">
                      Role
                    </label>

                    <select
                      className={`form-select ${
                        errors.role ? "is-invalid" : ""
                      }`}
                      {...register("role")}
                    >
                      <option value="operator">
                        Operator
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

                    <div className="invalid-feedback">
                      {errors.role?.message}
                    </div>

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={loading}
                  onClick={onClose}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk me-2" />
                      {isEdit ? "Update" : "Simpan"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}
