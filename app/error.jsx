"use client";

import { useTranslations } from "next-intl";

export default function AppError({ reset }) {
  const t = useTranslations("errors");

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[960px] flex-1 px-[15px] py-10 md:px-[30px]"
    >
      <h1 className="max-w-[660px] text-[32px] font-bold leading-tight md:text-[48px]">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-[660px] text-[19px] leading-[1.315]">
        {t("body")}
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center bg-[#00703c] px-5 py-3 text-[19px] font-bold text-white outline-none hover:bg-[#005a30] focus-visible:ring-[3px] focus-visible:ring-[#ffdd00]"
        >
          {t("retry")}
        </button>
        <a
          href="/"
          className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
        >
          {t("home")}
        </a>
      </div>
    </main>
  );
}
