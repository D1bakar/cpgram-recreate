"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [light, setLight] = useState(true);

  useEffect(() => {
    setLight(!document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    try {
      localStorage.setItem("theme", theme);
      document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // ignore storage failures
    }
    setLight(!isDark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      {light ? "Dark" : "Light"}
    </button>
  );
}
