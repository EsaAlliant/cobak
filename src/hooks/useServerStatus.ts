"use client";

import { useEffect, useState } from "react";

export function useServerStatus() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/website", {
      cache: "no-store",
    })
      .then(() => {
        if (mounted) setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return loading;
}