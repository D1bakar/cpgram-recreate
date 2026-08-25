"use client";

import { useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { GrievanceTimeline } from "@/components/grievance-timeline";
import { StatusTimeline } from "@/components/status-timeline";
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
            className="mb-8 rounded-3xl border border-destructive/40 bg-card px-5 py-5 outline-none"
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
          className="mt-10 space-y-10 border-t border-border pt-10"
        >
          <div>
            <h2 id="status-heading" className="text-2xl font-extrabold">
              {t("statusHeading")}
            </h2>
            <dl className="mt-6 space-y-3 text-base">
              <div>
                <dt className="font-semibold">{t("reference")}</dt>
                <dd className="mt-1 font-mono">{complaint.registrationNumber}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t("currentStatus")}</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${statusClass(
                      complaint.status,
                    )}`}
                  >
                    {statusLabel(complaint.status)}
                  </span>
                </dd>
              </div>
              {complaint.department ? (
                <div>
                  <dt className="font-semibold">{t("department")}</dt>
                  <dd className="mt-1">{complaint.department}</dd>
                </div>
              ) : null}
              {complaint.subject ? (
                <div>
                  <dt className="font-semibold">{t("subject")}</dt>
                  <dd className="mt-1">{complaint.subject}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-semibold">{t("lastUpdated")}</dt>
                <dd className="mt-1">
                  {formatDate(complaint.updatedAt ?? complaint.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-xl font-extrabold">
              {t("latestResponse")}
            </h3>
            <p className="mt-3 text-base leading-7 text-foreground">
              {latestNote || t("noResponse")}
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-extrabold">
              {t("timeline")}
            </h3>
            <StatusTimeline complaint={complaint} />
            <div className="mt-8">
              <GrievanceTimeline history={complaint.history} locale={locale} />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-xl font-extrabold">{t("nextAction")}</h3>
            <p className="mt-3 text-base leading-7 text-foreground">
              {nextAction(complaint.status)}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
