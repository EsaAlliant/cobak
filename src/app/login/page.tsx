"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/roles";
import type { SessionPayload } from "@/lib/session";
import { initialsFromText, useWebsiteSettings } from "@/lib/site-settings";
import { setClientSessionCache } from "@/lib/client-session";
import { useAuth } from "@/components/AuthContext";

type ProfileRow = {
  id: string;
  name: string;
  role: UserRole;
  is_active: boolean | null;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const { settings } = useWebsiteSettings();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError(error?.message || "Login gagal");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id,name,role,is_active")
      .eq("id", data.user.id)
      .maybeSingle();

      

    console.log("AUTH USER:", data.user);
console.log("PROFILE:", profile);
console.log("PROFILE ERROR:", profileError);

if (profileError || !profile) {
  setError(
    JSON.stringify({
      profile,
      profileError,
    })
  );
  setLoading(false);
  return;
}

    if (profile.is_active === false) {
      await supabase.auth.signOut();
      setError("Akun ini dinonaktifkan oleh admin.");
      setLoading(false);
      return;
    }

    const sessionPayload: SessionPayload = {
      userId: profile.id,
      email: data.user.email ?? email,
      name: profile.name,
      role: profile.role,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * (remember ? 30 : 7),
    };

    const sessionResponse = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sessionPayload, remember }),
    });

    if (!sessionResponse.ok) {
      setError("Session gagal dibuat. Cek SESSION_SECRET dan konfigurasi server.");
      setLoading(false);
      return;
    }

    setClientSessionCache(sessionPayload);
    setSession(sessionPayload);
    router.replace(nextUrl);
  };

  return (
    <div className="card login-card shadow-xl border-0">
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="login-brand mx-auto mb-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.namaWebsite} className="brand-logo-img" />
            ) : (
              <span className="fw-bold">{initialsFromText(settings.namaWebsite)}</span>
            )}
          </div>

          <span className="badge rounded-pill text-bg-primary-subtle text-primary mb-3">Portal Admin</span>
          <h1 className="h2 fw-bold mb-2">Masuk ke CMS Desa</h1>
          <p className="text-muted mb-0">
            Kelola konten website, UMKM, pengguna, dan pengaturan desa dari satu tempat.
          </p>
        </div>

        <div className="d-none d-md-flex flex-wrap justify-content-center gap-2 mb-4">
          <span className="feature-chip login-chip">
            <i className="fa-solid fa-shield-halved" />
            Akses sesuai role
          </span>
          <span className="feature-chip login-chip">
            <i className="fa-solid fa-clock-rotate-left" />
            Session stabil
          </span>
          <span className="feature-chip login-chip">
            <i className="fa-solid fa-mobile-screen" />
            Nyaman di HP
          </span>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@glagaharum.desa.id"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberLogin"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberLogin">
                Ingat saya
              </label>
            </div>
            <span className="text-muted small">Admin dan Operator</span>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <button className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Sedang login...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <Link href="/" className="text-decoration-none">
              <i className="fa-solid fa-arrow-left me-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="login-shell">
      <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4 py-lg-5">
        <div className="login-card-wrap w-100">
          <Suspense fallback={<div className="spinner-border text-light" role="status" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
