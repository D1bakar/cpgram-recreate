"use client";

import { useLocale, useTranslations } from "next-intl";

function collapseHistory(history = []) {
  const items = [];
  for (const entry of history) {
    const prev = items[items.length - 1];
    const sameStatus = prev && prev.status === entry.status;
    const noNewNote = !entry.note?.trim();
    if (sameStatus && noNewNote) continue;
    items.push(entry);
  }
  return items;
}

export function GrievanceTimeline({ history = [], locale }) {
  const t = useTranslations("track");
  const activeLocale = useLocale();
  const dateLocale = locale || activeLocale;
  const items = collapseHistory(history);

  function formatDate(value) {
    return new Date(value).toLocaleString(
      dateLocale === "hi" ? "hi-IN" : "en-IN",
      { dateStyle: "medium", timeStyle: "short" },
    );
  }

  if (!items.length) {
    return <p className="text-[19px] text-[#505a5f]">{t("waiting")}</p>;
  }

  return (
    <ol className="border-l-[4px] border-[#1b4332] pl-5">
      {items.map((entry, index) => {
        const label =
          {
            Received: t("statuses.Received"),
            "Under Review": t("statuses.Under Review"),
            Resolved: t("statuses.Resolved"),
            Rejected: t("statuses.Rejected"),
          }[entry.status] ?? entry.status;

        return (
          <li
            key={String(entry._id ?? `${entry.status}-${entry.at}-${index}`)}
            className="relative pb-8 last:pb-0"
          >
            <h3 className="text-[19px] font-bold text-[#0b0c0c]">{label}</h3>
            {entry.note?.trim() ? (
              <p className="mt-2 text-[19px] leading-[1.315] text-[#0b0c0c]">
                {entry.note}
              </p>
            ) : null}
            <p className="mt-1 text-[16px] text-[#505a5f]">{formatDate(entry.at)}</p>
          </li>
        );
      })}
    </ol>
  );
}
