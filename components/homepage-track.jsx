"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function HomepageTrack() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    const ref = value.trim();
    if (!ref) {
      setError(t("trackEmpty"));
      return;
    }
    setError("");
    router.push(`/${locale}/track?ref=${encodeURIComponent(ref)}`);
  }

  return (
    <search className="mt-6 block max-w-[640px]">
      <form onSubmit={onSubmit}>
        <label htmlFor="home-track" className="block text-[19px] font-bold">
          {t("trackLabel")}
        </label>
        <p id="home-track-hint" className="mt-1 text-[16px] text-[#505a5f]">
          {t("trackHint")}
        </p>
        <div className="mt-2 flex min-w-0">
          <input
            id="home-track"
            name="ref"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "home-track-hint home-track-error" : "home-track-hint"
            }
            className="min-w-0 flex-1 border-2 border-[#0b0c0c] px-3 py-2 text-[19px] outline-none focus:ring-[3px] focus:ring-[#ffdd00] aria-[invalid=true]:border-[#d4351c]"
          />
          <button
            type="submit"
            className="shrink-0 bg-[#00703c] px-4 py-2 text-[19px] font-bold text-white outline-none hover:bg-[#005a30] focus:ring-[3px] focus:ring-[#ffdd00] sm:px-6"
          >
            {t("track")}
          </button>
        </div>
        {error ? (
          <p
            id="home-track-error"
            className="mt-2 text-base font-bold text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>
    </search>
  );
}
