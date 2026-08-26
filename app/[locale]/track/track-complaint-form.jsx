"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { GrievanceTimeline } from "@/components/grievance-timeline";
import { Button } from "@/components/ui/button";
import {
  errorClassName,
  fieldClassName,
  hintClassName,
  labelClassName,
} from "@/lib/form-styles";
import { readJson } from "@/lib/read-json";

function isValidRegistration(value) {
  return /^[A-Za-z0-9/-]{6,20}$/.test(value.trim());
}

function statusClass(status) {
  switch (status) {
    case "Under Review":
      return "text-[#1d70b8]";
    case "Resolved":
      return "text-[#00703c]";
    case "Rejected":
      return "text-[#d4351c]";
    default:
      return "text-[#0b0c0c]";
  }
}

function formatSafeDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TrackComplaintForm() {
  const t = useTranslations("track");
  const tv = useTranslations("validation");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const errorSummaryId = useId();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const requestId = useRef(0);

  function statusLabel(status) {
    const map = {
      Received: t("statuses.Received"),
      "Under Review": t("statuses.Under Review"),
      Resolved: t("statuses.Resolved"),
      Rejected: t("statuses.Rejected"),
    };
    return map[status] ?? status;
  }

  function nextAction(status) {
    switch (status) {
      case "Under Review":
        return t("nextReview");
      case "Resolved":
        return t("nextResolved");
      case "Rejected":
        return t("nextRejected");
      default:
        return t("nextReceived");
    }
  }

  const lookup = useCallback(
    async (number, signal) => {
      const id = ++requestId.current;
      setError("");
      setLoading(true);
      setComplaint(null);

      try {
        const response = await fetch(
          `/api/complaints/${encodeURIComponent(number.trim().toUpperCase())}`,
          { signal },
        );
        if (id !== requestId.current) return;
        const data = await readJson(response);

        if (!response.ok) {
          const message =
            response.status === 404
              ? tv("notFound")
              : response.status === 400
                ? tv("registrationInvalid")
                : tv("generic");
          setError(message);
          document.getElementById(errorSummaryId)?.focus();
          return;
        }

        if (!data?.complaint) {
          setError(tv("generic"));
          document.getElementById(errorSummaryId)?.focus();
          return;
        }

        setComplaint(data.complaint);
      } catch (caught) {
        if (caught?.name === "AbortError") return;
        if (id !== requestId.current) return;
        setError(tv("generic"));
        document.getElementById(errorSummaryId)?.focus();
      } finally {
        if (id === requestId.current) {
          setLoading(false);
        }
      }
    },
    [errorSummaryId, tv],
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!registrationNumber.trim()) {
      setError(tv("registration"));
      setComplaint(null);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    if (!isValidRegistration(registrationNumber)) {
      setError(tv("registrationInvalid"));
      setComplaint(null);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    await lookup(registrationNumber);
  }

  const refParam = searchParams.get("ref");

  useEffect(() => {
    if (!refParam) return undefined;

    setRegistrationNumber(refParam);
    if (!isValidRegistration(refParam)) {
      setError(tv("registrationInvalid"));
      return undefined;
    }

    const controller = new AbortController();
    lookup(refParam, controller.signal);
    return () => controller.abort();
  }, [lookup, refParam, tv]);

  const latestNote = complaint?.history
    ?.slice()
    .reverse()
    .find((entry) => entry.note?.trim())?.note;

  const updatedLabel = formatSafeDate(
    complaint?.updatedAt ?? complaint?.createdAt,
    locale,
  );

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {error ? (
          <div
            id={errorSummaryId}
            tabIndex={-1}
            role="alert"
            className="mb-8 border-l-8 border-[#d4351c] bg-[#f3f2f1] px-5 py-5 outline-none"
          >
            <h2 className="text-lg font-semibold text-destructive">
              {t("errorTitle")}
            </h2>
            <p className="mt-3 text-base">
              <a
                href="#registrationNumber"
                className="font-medium text-destructive underline-offset-4 hover:underline"
              >
                {error}
              </a>
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor="registrationNumber" className={labelClassName}>
            {t("registrationNumber")}
          </label>
          <p id="registrationNumber-hint" className={hintClassName}>
            {t("registrationHint")}
          </p>
          <input
            id="registrationNumber"
            name="registrationNumber"
            autoComplete="off"
            spellCheck="false"
            required
            value={registrationNumber}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? "registrationNumber-hint registrationNumber-error"
                : "registrationNumber-hint"
            }
            className={fieldClassName}
            onChange={(event) => {
              setRegistrationNumber(event.target.value);
              setComplaint(null);
            }}
          />
          {error ? (
            <p id="registrationNumber-error" className={errorClassName}>
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            size="lg"
            className="h-12 px-6 text-base"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? t("checking") : t("submit")}
          </Button>
        </div>
      </form>

      {complaint ? (
        <section
          aria-labelledby="status-heading"
          className="motion-safe:animate-reveal mt-10 border-t border-[#b1b4b6] pt-8"
        >
          <h2 id="status-heading" className="text-[24px] font-bold">
            {t("statusHeading")}
          </h2>

          <dl className="mt-6">
            <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
              <dt className="font-bold">{t("reference")}</dt>
              <dd className="mt-1 break-all font-mono sm:mt-0">
                {complaint.registrationNumber}
              </dd>
            </div>
            <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
              <dt className="font-bold">{t("currentStatus")}</dt>
              <dd
                className={`mt-1 font-bold sm:mt-0 ${statusClass(complaint.status)}`}
              >
                {statusLabel(complaint.status)}
              </dd>
            </div>
            {complaint.department ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                <dt className="font-bold">{t("department")}</dt>
                <dd className="mt-1 break-words sm:mt-0">
                  {complaint.department}
                </dd>
              </div>
            ) : null}
            {complaint.subject ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                <dt className="font-bold">{t("subject")}</dt>
                <dd className="mt-1 break-words sm:mt-0">
                  {complaint.subject}
                </dd>
              </div>
            ) : null}
            {complaint.details ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                <dt className="font-bold">{t("description")}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-foreground sm:mt-0">
                  {complaint.details}
                </dd>
              </div>
            ) : null}
            {complaint.media?.length ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                <dt className="font-bold">{t("attachments")}</dt>
                <dd className="mt-1 sm:mt-0">
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {complaint.media.map((item) => (
                      <li key={item.url}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="block overflow-hidden rounded-lg border border-[#b1b4b6]"
                        >
                          <img
                            src={item.url}
                            alt={item.name || t("attachments")}
                            className="h-32 w-full object-cover"
                            loading="lazy"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            {updatedLabel ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
                <dt className="font-bold">{t("lastUpdated")}</dt>
                <dd className="mt-1 sm:mt-0">{updatedLabel}</dd>
              </div>
            ) : null}
          </dl>

          <h3 className="mt-10 text-[19px] font-bold">{t("latestResponse")}</h3>
          <p className="mt-3 text-[19px] leading-[1.315] break-words">
            {latestNote || t("noResponse")}
          </p>

          <h3 className="mt-10 text-[19px] font-bold">{t("timeline")}</h3>
          <div className="mt-5">
            <GrievanceTimeline history={complaint.history} locale={locale} />
          </div>

          <h3 className="mt-10 text-[19px] font-bold">{t("nextAction")}</h3>
          <p className="mt-3 text-[19px] leading-[1.315]">
            {nextAction(complaint.status)}
          </p>
        </section>
      ) : null}
    </div>
  );
}
