"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { GoiEmblem } from "@/components/goi-emblem";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="mt-auto border-t border-[#c5d5cc] bg-[#eaf2ee] text-[#1b4332]">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-[15px] py-8 md:flex-row md:items-start md:justify-between md:px-[30px]">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex bg-white p-1">
              <GoiEmblem className="h-10 w-auto" alt={t("brand.emblemAlt")} />
            </span>
            <div>
              <p className="text-[19px] font-bold">CPGRAMS</p>
              <p className="text-[16px]">{t("brand.goi")}</p>
            </div>
          </div>
          <p className="mt-4 text-[16px] leading-6">{t("footer.about")}</p>
          <p className="mt-2 text-[16px] leading-6">{t("footer.help")}</p>
        </div>
        <nav aria-label={t("footer.support")} className="flex flex-col gap-3">
          <Link
            href={`/${locale}/file-complaint`}
            className="text-[16px] font-bold text-[#1b4332] underline underline-offset-4 hover:text-[#1d70b8]"
          >
            {t("nav.fileComplaint")}
          </Link>
          <Link
            href={`/${locale}/track`}
            className="text-[16px] font-bold text-[#1b4332] underline underline-offset-4 hover:text-[#1d70b8]"
          >
            {t("nav.trackStatus")}
          </Link>
          <Link
            href="/admin"
            className="text-[16px] font-bold text-[#1b4332] underline underline-offset-4 hover:text-[#1d70b8]"
          >
            {t("nav.admin")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
