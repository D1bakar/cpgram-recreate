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
  ];

  const notes = [
    t("notes.free"),
    t("notes.contact"),
    t("notes.track"),
    t("notes.department"),
  ];

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 sm:py-24"
    >
      <section className="max-w-2xl">
        <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/file-complaint" />}
            className="h-12 px-6 text-base"
          >
            {t("hero.cta")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/track" />}
            className="h-12 px-6 text-base"
          >
            {t("hero.track")}
          </Button>
        </div>
      </section>

      <section className="mt-20 border-t border-border pt-16">
        <Eyebrow>{t("steps.eyebrow")}</Eyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {t("steps.title")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="font-mono text-sm text-[#6798ff]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
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
        <Eyebrow>{t("notes.eyebrow")}</Eyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {t("notes.title")}
        </h2>
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-sm leading-6 text-foreground"
              >
                <span aria-hidden="true" className="mt-1 text-[#6798ff]">
                  →
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
