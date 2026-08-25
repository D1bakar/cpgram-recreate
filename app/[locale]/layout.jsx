import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["en", "hi"];

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return children;
}
