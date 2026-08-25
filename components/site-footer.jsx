"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            CPGRAMS
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("footer.about")}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("footer.help")}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href={`/${locale}/file-complaint`}
            className="text-sm font-medium text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.fileComplaint")}
          </Link>
          <Link
            href={`/${locale}/track`}
            className="text-sm font-medium text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.trackStatus")}
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.admin")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
