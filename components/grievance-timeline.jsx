"use client";

import { useLocale, useTranslations } from "next-intl";

function statusClass(status) {
  switch (status) {
    case "Under Review":
      return "bg-clay/15 text-clay-deep";
    case "Resolved":
      return "bg-oat-warm text-slate-dark";
    case "Rejected":
      return "bg-destructive/15 text-destructive";
    case "Received":
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function GrievanceTimeline({ history = [], locale }) {
  const t = useTranslations("track");
  const activeLocale = useLocale();
  const dateLocale = locale || activeLocale;

  function formatDate(value) {
    return new Date(value).toLocaleString(
      dateLocale === "hi" ? "hi-IN" : "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );
  }

  if (!history.length) {
    return (
      <p className="text-base text-muted-foreground">{t("waiting")}</p>
    );
  }

  return (
    <ol className="relative space-y-0 border-l-2 border-border pl-6">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const label =
          {
            Received: t("statuses.Received"),
            "Under Review": t("statuses.Under Review"),
            Resolved: t("statuses.Resolved"),
            Rejected: t("statuses.Rejected"),
          }[entry.status] ?? entry.status;

        return (
          <li key={String(entry._id ?? `${entry.status}-${entry.at}`)} className="relative pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[1.55rem] top-1 size-3 rounded-full border-2 border-background ${
                isLast ? "bg-clay" : "bg-cloud-dark"
              }`}
            />
            <p
              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${statusClass(
                entry.status,
              )}`}
            >
              {label}
            </p>
            {entry.note ? (
              <p className="mt-2 text-base leading-7 text-foreground">
                {entry.note}
              </p>
            ) : (
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                {t("waiting")}
              </p>
            )}
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {formatDate(entry.at)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
