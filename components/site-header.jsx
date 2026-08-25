"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { GoiEmblem } from "@/components/goi-emblem";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/file-complaint`, label: t("fileComplaint") },
    { href: `/${locale}/track`, label: t("trackStatus") },
    { href: `/${locale}#how-it-works`, label: t("howItWorks") },
    { href: `/${locale}#what-you-can-complain-about`, label: t("whatYouCan") },
    { href: "/admin", label: t("admin") },
  ];

  return (
    <header className="border-b border-[#c5d5cc] bg-[#eaf2ee] text-[#1b4332]">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between gap-4 px-[15px] py-3 md:px-[30px]">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffdd00]"
        >
          <span className="inline-flex items-center justify-center bg-white p-1.5 shadow-sm">
            <GoiEmblem className="h-14 w-auto sm:h-16" alt={brand("emblemAlt")} />
          </span>
          <span className="font-bold text-[24px] leading-none tracking-tight text-[#1b4332] sm:text-[30px]">
            CPGRAMS
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="govuk-menu"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex items-center gap-2 border border-[#1b4332] px-3 py-2 text-[19px] font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffdd00] ${
              open ? "relative z-20 border-b-0 bg-white text-[#1b4332]" : "bg-transparent text-[#1b4332]"
            }`}
          >
            {t("menu")}
            <span className="relative block h-3.5 w-[18px]" aria-hidden="true">
              <span className="absolute left-0 top-0 h-[2px] w-full bg-[#1b4332]" />
              <span className="absolute left-0 top-[6px] h-[2px] w-full bg-[#1b4332]" />
              <span className="absolute left-0 top-[12px] h-[2px] w-full bg-[#1b4332]" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div id="govuk-menu" className="border-b-[10px] border-[#1d70b8] bg-white text-[#0b0c0c]">
          <nav
            aria-label={t("menu")}
            className="mx-auto grid w-full max-w-[960px] gap-8 px-[15px] py-8 md:grid-cols-2 md:px-[30px]"
          >
            <div>
              <h2 className="mb-4 text-[24px] font-bold">{t("services")}</h2>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isCurrent =
                    pathname === link.href ||
                    (link.href !== `/${locale}` &&
                      !link.href.includes("#") &&
                      pathname.startsWith(link.href));
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={isCurrent ? "page" : undefined}
                        className="text-[19px] font-bold text-[#1d70b8] underline decoration-[#1d70b8] underline-offset-4 outline-none hover:text-[#003078] focus-visible:bg-[#ffdd00] focus-visible:text-[#0b0c0c]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-[24px] font-bold">{brand("goi")}</h2>
              <p className="text-[19px] leading-[1.315] text-[#0b0c0c]">
                {brand("product")}
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
