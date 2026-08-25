"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher({ inverted = false }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale) => {
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "hi") {
      segments[1] = newLocale;
      router.push(segments.join("/") || `/${newLocale}`);
    } else {
      router.push(`/${newLocale}`);
    }
    router.refresh();
  };

  const other = locale === "en" ? "hi" : "en";
  const label = other === "hi" ? "हिन्दी" : "English";

  return (
    <button
      type="button"
      onClick={() => changeLanguage(other)}
      className={`text-[16px] font-bold underline underline-offset-4 outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffdd00] ${
        inverted ? "text-white decoration-white" : "text-[#1d70b8]"
      }`}
    >
      {label}
    </button>
  );
}
