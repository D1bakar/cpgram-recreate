import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FileComplaintForm } from "./file-complaint-form";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fileComplaint" });
  return {
    title: `${t("title")} — CPGRAMS`,
    description: t("intro"),
  };
}

export default async function FileComplaintPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fileComplaint");
  const nav = await getTranslations("nav");

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[960px] flex-1 px-[15px] py-10 md:px-[30px]"
    >
      <Link
        href={`/${locale}`}
        className="inline-block text-[16px] text-[#0b0c0c] underline underline-offset-4 hover:text-[#1d70b8]"
      >
        {nav("back")}
      </Link>
      <h1 className="mt-6 max-w-[660px] text-[32px] font-bold leading-tight md:text-[48px]">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-[660px] text-[19px] leading-[1.315]">
        {t("intro")}
      </p>
      <div className="mt-8">
        <FileComplaintForm />
      </div>
    </main>
  );
}
