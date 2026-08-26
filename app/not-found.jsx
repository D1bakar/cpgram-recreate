import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("errors");

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[960px] flex-1 px-[15px] py-10 md:px-[30px]"
    >
      <h1 className="max-w-[660px] text-[32px] font-bold leading-tight md:text-[48px]">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-5 max-w-[660px] text-[19px] leading-[1.315]">
        {t("notFoundBody")}
      </p>
      <p className="mt-8">
        <Link
          href={`/${locale}`}
          className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
        >
          {t("home")}
        </Link>
      </p>
    </main>
  );
}
