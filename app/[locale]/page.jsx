import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const steps = [
    { title: t("steps.step1_title"), body: t("steps.step1_desc") },
    { title: t("steps.step2_title"), body: t("steps.step2_desc") },
    { title: t("steps.step3_title"), body: t("steps.step3_desc") },
    { title: t("steps.step4_title"), body: t("steps.step4_desc") },
  ];

  const notes = [
    t("notes.emergency"),
    t("notes.free"),
    t("notes.contact"),
    t("notes.track"),
    t("notes.department"),
  ];

  const includes = t.raw("scope.includes");
  const excludes = t.raw("scope.excludes");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-16 sm:px-6 sm:py-24"
    >
      <section className="max-w-2xl">
        <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
        <h1 className="mt-4 max-w-xl font-serif text-4xl font-medium tracking-[-0.12px] text-foreground sm:text-5xl lg:text-[61px] lg:leading-[1.1]">
          {t("hero.title")}
        </h1>
        <p className="mt-5 max-w-md text-[20px] leading-[1.4] text-muted-foreground">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={`/${locale}/file-complaint`} />}
            className="h-12 px-6 text-base"
          >
            {t("hero.cta")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href={`/${locale}/track`} />}
            className="h-12 px-6 text-base"
          >
            {t("hero.track")}
          </Button>
        </div>
      </section>

      <section className="mt-20 border-t border-border pt-16">
        <Eyebrow>{t("steps.eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground">
          {t("steps.title")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8"
            >
              <p className="font-mono text-sm text-clay">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-lg font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <Eyebrow>{t("scope.eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground">
          {t("scope.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {t("scope.intro")}
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h3 className="font-serif text-lg font-medium">
              {t("scope.includes_title")}
            </h3>
            <ul className="mt-4 space-y-3">
              {includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-foreground"
                >
                  <span aria-hidden="true" className="mt-1 text-clay">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h3 className="font-serif text-lg font-medium">
              {t("scope.excludes_title")}
            </h3>
            <ul className="mt-4 space-y-3">
              {excludes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-foreground"
                >
                  <span aria-hidden="true" className="mt-1 text-muted-foreground">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <Eyebrow>{t("notes.eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground">
          {t("notes.title")}
        </h2>
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-sm leading-6 text-foreground"
              >
                <span aria-hidden="true" className="mt-1 text-clay">
                  →
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground">
          {t("faq.title")}
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((item) => (
            <div key={item.q} className="max-w-2xl">
              <h3 className="font-serif text-lg font-medium text-foreground">
                {item.q}
              </h3>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
