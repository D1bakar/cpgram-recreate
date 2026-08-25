"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function HomepageTrack() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    const ref = value.trim();
    if (!ref) return;
    router.push(`/${locale}/track?ref=${encodeURIComponent(ref)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-[640px]" role="search">
      <label htmlFor="home-track" className="block text-[19px] font-bold">
        {t("trackLabel")}
      </label>
      <p id="home-track-hint" className="mt-1 text-[16px] text-[#505a5f]">
        {t("trackHint")}
      </p>
      <div className="mt-2 flex">
        <input
          id="home-track"
          name="ref"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby="home-track-hint"
          className="min-w-0 flex-1 border-2 border-[#0b0c0c] px-3 py-2 text-[19px] outline-none focus:ring-[3px] focus:ring-[#ffdd00]"
        />
        <button
          type="submit"
          className="bg-[#00703c] px-6 py-2 text-[19px] font-bold text-white outline-none hover:bg-[#005a30] focus:ring-[3px] focus:ring-[#ffdd00]"
        >
          {t("track")}
        </button>
      </div>
    </form>
  );
}
