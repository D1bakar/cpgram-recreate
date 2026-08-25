"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="mt-auto border-t-[10px] border-[#1d70b8] bg-[#f3f2f1] text-[#0b0c0c]">
      <div className="mx-auto w-full max-w-[960px] px-[15px] py-10 md:px-[30px]">
        <h2 className="text-[24px] font-bold">{t("footer.support")}</h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <Link
              href={`/${locale}/file-complaint`}
              className="text-[16px] text-[#0b0c0c] underline decoration-[#0b0c0c] underline-offset-4 hover:text-[#1d70b8]"
            >
              {t("nav.fileComplaint")}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/track`}
              className="text-[16px] text-[#0b0c0c] underline decoration-[#0b0c0c] underline-offset-4 hover:text-[#1d70b8]"
            >
              {t("nav.trackStatus")}
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="text-[16px] text-[#0b0c0c] underline decoration-[#0b0c0c] underline-offset-4 hover:text-[#1d70b8]"
            >
              {t("nav.admin")}
            </Link>
          </li>
        </ul>
        <p className="mt-8 max-w-3xl text-[16px] leading-6 text-[#0b0c0c]">
          {t("footer.about")}
        </p>
        <p className="mt-3 max-w-3xl text-[16px] leading-6 text-[#0b0c0c]">
          {t("footer.help")}
        </p>
        <p className="mt-8 text-[16px] font-bold">{t("brand.goi")}</p>
      </div>
    </footer>
  );
}
