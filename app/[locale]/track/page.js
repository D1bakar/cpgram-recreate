import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Eyebrow } from "@/components/eyebrow";

import { TrackComplaintForm } from "./track-complaint-form";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "track" });
  return {
    title: `${t("title")} — CPGRAMS`,
    description: t("intro"),
  };
}

export default async function TrackComplaintPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("track");

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h1 className="mt-3 max-w-xl font-serif text-3xl font-medium tracking-tight text-pretty sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-foreground">
        {t("intro")}
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted-foreground">{t("checking")}</p>}>
          <TrackComplaintForm />
        </Suspense>
      </div>
    </main>
  );
}
