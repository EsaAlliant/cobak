"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const value = (window.scrollY / height) * 100;

      setProgress(value);
    };

    window.addEventListener("scroll", update);

    update();

    return () =>
      window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{
        width: `${progress}%`,
      }}
    />
  );
}