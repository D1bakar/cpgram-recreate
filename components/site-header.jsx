"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GoiEmblem } from "@/components/goi-emblem";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale, useTranslations } from "next-intl";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/file-complaint`, label: t("fileComplaint") },
    { href: `/${locale}/track`, label: t("trackStatus") },
    { href: "/admin", label: t("admin") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur transition-colors duration-300 ${
        open ? "bg-background/90" : "bg-background/90"
      }`}
    >
      <div className="flex h-1.5 w-full" aria-hidden="true">
        <span className="flex-1 bg-[#FF9933]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-2 sm:px-6">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            {brand("goi")}
          </span>
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            {brand("official")}
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-3 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <GoiEmblem className="h-14 w-auto shrink-0 sm:h-16" alt={brand("emblemAlt")} />
          <span className="min-w-0">
            <span className="block text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              CPGRAMS
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-muted-foreground sm:text-base">
              {brand("product")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Primary"
            className="hidden flex-wrap items-center gap-1 md:flex"
          >
            {links.map((link) => {
              const isCurrent =
                pathname === link.href ||
                (link.href !== `/${locale}` &&
                  pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-base font-bold transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring ${
                    isCurrent
                      ? "bg-muted text-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-foreground transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-border transition-all duration-300 md:hidden ${
          open ? "max-h-64 border-t" : "max-h-0"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex w-full max-w-[1280px] flex-col gap-1 px-4 py-3 sm:px-6"
        >
          {links.map((link) => {
            const isCurrent =
              pathname === link.href ||
              (link.href !== `/${locale}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent ? "page" : undefined}
                className={`rounded-md px-4 py-3 text-lg font-bold transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring ${
                  isCurrent
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
