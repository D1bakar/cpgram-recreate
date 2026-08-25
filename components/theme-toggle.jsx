"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ inverted = false }) {
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
      className={`px-3 py-2 text-[16px] font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffdd00] ${
        inverted
          ? "border border-white text-white hover:bg-white hover:text-[#0b0c0c]"
          : "border border-border text-foreground hover:bg-muted"
      }`}
    >
      {light ? "Dark" : "Light"}
    </button>
  );
}
