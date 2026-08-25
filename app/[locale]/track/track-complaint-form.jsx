"use client";

import { useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { GrievanceTimeline } from "@/components/grievance-timeline";
import { Button } from "@/components/ui/button";
import {
  errorClassName,
  fieldClassName,
  hintClassName,
  labelClassName,
} from "@/lib/form-styles";

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

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setRegistrationNumber(ref);
    }
  }, [searchParams]);

  function formatDate(value) {
    return new Date(value).toLocaleString(
      locale === "hi" ? "hi-IN" : "en-IN",
      { dateStyle: "medium", timeStyle: "short" },
    );
  }

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
      case "Received":
      default:
        return t("nextReceived");
    }
  }

  async function lookup(number) {
    setError("");
    setLoading(true);
    setComplaint(null);

    try {
      const response = await fetch(
        `/api/complaints/${encodeURIComponent(number.trim().toUpperCase())}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? tv("notFound"));
        document.getElementById(errorSummaryId)?.focus();
        return;
      }

      setComplaint(data.complaint);
    } catch {
      setError(tv("generic"));
      document.getElementById(errorSummaryId)?.focus();
    } finally {
      setLoading(false);
    }
  }

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

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && isValidRegistration(ref)) {
      lookup(ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot preload from query
  }, []);

  const latestNote = complaint?.history
    ?.slice()
    .reverse()
    .find((entry) => entry.note && entry.note.trim())?.note;

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {error ? (
          <div
            id={errorSummaryId}
            tabIndex={-1}
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
            <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
              <dt className="font-bold">{t("reference")}</dt>
              <dd className="mt-1 font-mono sm:mt-0">{complaint.registrationNumber}</dd>
            </div>
            <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
              <dt className="font-bold">{t("currentStatus")}</dt>
              <dd className={`mt-1 font-bold sm:mt-0 ${statusClass(complaint.status)}`}>
                {statusLabel(complaint.status)}
              </dd>
            </div>
            {complaint.department ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
                <dt className="font-bold">{t("department")}</dt>
                <dd className="mt-1 sm:mt-0">{complaint.department}</dd>
              </div>
            ) : null}
            {complaint.subject ? (
              <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
                <dt className="font-bold">{t("subject")}</dt>
                <dd className="mt-1 sm:mt-0">{complaint.subject}</dd>
              </div>
            ) : null}
            <div className="border-b border-[#b1b4b6] py-4 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
              <dt className="font-bold">{t("lastUpdated")}</dt>
              <dd className="mt-1 sm:mt-0">
                {formatDate(complaint.updatedAt ?? complaint.createdAt)}
              </dd>
            </div>
          </dl>

          <h3 className="mt-10 text-[19px] font-bold">{t("latestResponse")}</h3>
          <p className="mt-3 text-[19px] leading-[1.315]">
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
