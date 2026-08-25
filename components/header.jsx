"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
        {/* Left: Emblem + Title */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src="/emblem.svg"
              alt="National Emblem of India"
              width={50}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
              CPGRAMS
            </h1>
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Government of India
            </p>
          </div>
        </div>

        {/* Right: Navigation + Language Switcher */}
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            {t("home")}
          </Link>
          <Link
            href="/file-complaint"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            {t("fileComplaint")}
          </Link>          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}