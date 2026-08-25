"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
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

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {["en", "hi"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => changeLanguage(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring ${
            locale === code
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {code === "en" ? "EN" : "हि"}
        </button>
      ))}
    </div>
  );
}
