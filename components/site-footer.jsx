"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { GoiEmblem } from "@/components/goi-emblem";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="border-t border-border bg-background">
      <div className="flex h-1.5 w-full" aria-hidden="true">
        <span className="flex-1 bg-[#FF9933]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-lg">
          <div className="flex items-center gap-3">
            <GoiEmblem className="h-12 w-auto" alt={t("brand.emblemAlt")} />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-foreground">
                CPGRAMS
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {t("brand.goi")}
              </p>
            </div>
          </div>
          <p className="mt-4 text-base leading-7 text-foreground">
            {t("footer.about")}
          </p>
          <p className="mt-3 text-base leading-7 text-foreground">
            {t("footer.help")}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link
            href={`/${locale}/file-complaint`}
            className="text-base font-bold text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.fileComplaint")}
          </Link>
          <Link
            href={`/${locale}/track`}
            className="text-base font-bold text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.trackStatus")}
          </Link>
          <Link
            href="/admin"
            className="text-base font-bold text-foreground outline-none transition-colors hover:text-clay focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("nav.admin")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
