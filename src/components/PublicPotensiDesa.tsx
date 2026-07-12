"use client";

import { useEffect, useState } from "react";

type Potensi = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string | null;
};

export default function PublicPotensiDesa() {
  const [items, setItems] = useState<Potensi[]>([]);

  useEffect(() => {
    fetch("/api/potensi-desa")
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => setItems(body?.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article key={item.id}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="feature-image"
            />
          ) : (
            <i className={`fa-solid ${item.icon || "fa-seedling"}`} />
          )}

          <h3>{item.title}</h3>

          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}