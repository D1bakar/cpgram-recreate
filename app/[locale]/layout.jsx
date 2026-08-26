import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

const locales = ["en", "hi"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `${t("title")} — CPGRAMS`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", hi: "/hi" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: "CPGRAMS (Hackathon Prototype)",
      title: `${t("title")} — CPGRAMS`,
      description: t("subtitle"),
      locale: locale === "hi" ? "hi_IN" : "en_IN",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "CPGRAMS Hackathon Prototype",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "",
      title: `${t("title")} — CPGRAMS`,
      description: t("subtitle"),
      images: ["/og-image.png"],
    },
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
