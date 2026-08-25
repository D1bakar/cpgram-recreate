import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomepageTrack } from "@/components/homepage-track";

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const services = [
    { title: t("steps.step1_title"), body: t("steps.step1_desc") },
    { title: t("steps.step2_title"), body: t("steps.step2_desc") },
    { title: t("steps.step3_title"), body: t("steps.step3_desc") },
    { title: t("steps.step4_title"), body: t("steps.step4_desc") },
    { title: t("scope.includes_title"), body: t.raw("scope.includes").join(". ") },
    { title: t("scope.excludes_title"), body: t.raw("scope.excludes").join(". ") },
  ];

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto w-full max-w-[960px] px-[15px] py-10 md:px-[30px] md:py-12">
        <h1 className="max-w-[660px] text-[32px] font-bold leading-[1.09375] text-[#0b0c0c] md:text-[48px] md:leading-[1.04167]">
          {t("hero.title")}
        </h1>
        <p className="mt-5 max-w-[660px] text-[19px] leading-[1.315] text-[#0b0c0c] md:text-[24px] md:leading-[1.25]">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8">
          <Link
            href={`/${locale}/file-complaint`}
            className="inline-flex items-center justify-center bg-[#00703c] px-5 py-3 text-[19px] font-bold text-white outline-none hover:bg-[#005a30] focus-visible:ring-[3px] focus-visible:ring-[#ffdd00]"
          >
            {t("nav.fileComplaint")}
          </Link>
        </div>
        <HomepageTrack />

        <section className="mt-12" aria-labelledby="popular-heading">
          <h2 id="popular-heading" className="text-[24px] font-bold md:text-[36px]">
            {t("popular.title")}
          </h2>
          <ul className="mt-5 space-y-3">
            <li>
              <Link
                href={`/${locale}/file-complaint`}
                className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
              >
                {t("popular.file")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/track`}
                className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
              >
                {t("popular.track")}
              </Link>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
              >
                {t("popular.how")}
              </a>
            </li>
            <li>
              <a
                href="#what-you-can-complain-about"
                className="text-[19px] font-bold text-[#1d70b8] underline underline-offset-4 hover:text-[#003078]"
              >
                {t("popular.scope")}
              </a>
            </li>
          </ul>
        </section>
      </div>

      <section
        id="how-it-works"
        className="bg-[#1d70b8] text-white"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto w-full max-w-[960px] px-[15px] py-10 md:px-[30px] md:py-12">
          <h2 id="services-heading" className="text-[24px] font-bold md:text-[36px]">
            {t("nav.services")}
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-8 md:grid-cols-2">
            {services.map((item) => (
              <li key={item.title}>
                <h3 className="text-[19px] font-bold">{item.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.25] text-white">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="what-you-can-complain-about"
        className="mx-auto w-full max-w-[960px] px-[15px] py-10 md:px-[30px] md:py-12"
        aria-labelledby="notes-heading"
      >
        <h2 id="notes-heading" className="text-[24px] font-bold md:text-[36px]">
          {t("notes.title")}
        </h2>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-[19px] leading-[1.315]">
          <li>{t("notes.emergency")}</li>
          <li>{t("notes.free")}</li>
          <li>{t("notes.contact")}</li>
          <li>{t("notes.track")}</li>
          <li>{t("notes.department")}</li>
        </ul>
      </section>
    </main>
  );
}
