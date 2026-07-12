"use client";

import { useEffect, useState } from "react";
import PublicSiteShell from "@/components/PublicSiteShell";

type VillageProfile = {
  village_name: string;
  hero_title: string;
  hero_description: string;
  hero_image_url?: string;
  sejarah: string;
  visi: string;
  misi: string;
};

type StrukturMember = {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

export default function ProfilPage() {
  const [profile, setProfile] = useState<VillageProfile | null>(null);
  const [struktur, setStruktur] = useState<StrukturMember[] | null>(null);

  useEffect(() => {
    fetch("/api/village-profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setProfile(body?.profile || null))
      .catch(() => setProfile(null));

    fetch("/api/struktur-organisasi")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setStruktur(body?.data || []))
      .catch(() => setStruktur([]));
  }, []);

  const misiItems =
    profile?.misi
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) || [];

  const pengurus = (struktur || [])
    .filter((member) => member.is_published !== false)
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

  return (
    <PublicSiteShell>
      <main>
        <section
          className={`profile-banner ${profile?.hero_image_url ? "has-image" : ""}`}
          style={profile?.hero_image_url ? { backgroundImage: `url(${profile.hero_image_url})` } : undefined}
        >
          <div className="container">
            <span className="eyebrow">Profil Desa</span>
            <h1>{profile?.hero_title || "Profil Desa"}</h1>
            <p className="lead">
              {profile?.hero_description || "Selamat datang di Profil Desa."}
            </p>
          </div>
        </section>

        <div className="container page-section">
          <div className="content-grid">
            <article className="content-card">
              <h2>Sejarah</h2>
              <p>{profile?.sejarah}</p>
            </article>

            <article className="content-card">
              <h2>Visi</h2>
              <p>{profile?.visi}</p>
            </article>

            <article className="content-card wide">
              <h2>Misi</h2>
              <ol>
                {misiItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="content-card wide">
              <h2>Struktur Organisasi</h2>
              {pengurus.length ? (
                <div className="struktur-grid">
                  {pengurus.map((member) => (
                    <div className="struktur-item" key={member.id}>
                      <span className="struktur-photo">
                        {member.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.photo_url} alt={member.name} />
                        ) : (
                          <i className="fa-solid fa-user" />
                        )}
                      </span>
                      <strong>{member.name}</strong>
                      <span className="struktur-role">{member.position}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Struktur organisasi desa akan segera ditampilkan.</p>
              )}
            </article>
          </div>
        </div>
      </main>
    </PublicSiteShell>
  );
}
