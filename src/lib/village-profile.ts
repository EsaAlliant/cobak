"use client";

import { useEffect, useState } from "react";

export type VillageProfile = {
  village_name: string;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  sejarah: string;
  visi: string;
  misi: string;
};

export const DEFAULT_PROFILE: VillageProfile = {
  village_name: "",
  hero_title: "",
  hero_description: "",
  hero_image_url: "",
  sejarah: "",
  visi: "",
  misi: "",
};

export function useVillageProfile() {

  const [profile, setProfile] =
    useState(DEFAULT_PROFILE);

  useEffect(() => {

    fetch("/api/village-profile")

      .then(r => r.ok ? r.json() : null)

      .then(data => {

        if (!data?.profile) return;

        setProfile(data.profile);

      })

      .catch(() => {});

  }, []);

  return {

    profile,

    setProfile,

  };

}