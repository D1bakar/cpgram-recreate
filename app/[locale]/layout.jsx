import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

const locales = ["en", "hi"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `${t("title")} — CPGRAMS`,
    description: t("subtitle"),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return children;
}
