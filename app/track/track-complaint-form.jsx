"use client";

import { useId, useState } from "react";

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
      return "bg-[#3b82f6]/10 text-[#3b82f6]";
    case "Resolved":
      return "bg-[#22c55e]/10 text-[#22c55e]";
    case "Rejected":
      return "bg-[#ef4444]/10 text-[#ef4444]";
    case "Received":
    default:
      return "bg-[#6b7280]/10 text-[#6b7280]";
  }
}

export function TrackComplaintForm() {
  const errorSummaryId = useId();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);

  function formatDate(value) {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!registrationNumber.trim()) {
      setError("Enter your registration number");
      setChecked(false);
      setComplaint(null);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    if (!isValidRegistration(registrationNumber)) {
      setError("Enter a registration number between 6 and 20 characters");
      setChecked(false);
      setComplaint(null);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    setError("");
    setLoading(true);
    setChecked(false);
    setComplaint(null);

    try {
      const response = await fetch(
        `/api/complaints/${encodeURIComponent(
          registrationNumber.trim().toUpperCase(),
        )}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ??
            "We could not find a complaint with that registration number",
        );
        document.getElementById(errorSummaryId)?.focus();
        return;
      }

      setComplaint(data.complaint);
      setChecked(true);
    } catch {
      setError("Something went wrong. Please try again.");
      document.getElementById(errorSummaryId)?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {error ? (
          <div
            id={errorSummaryId}
            tabIndex={-1}
            className="mb-8 border-l-4 border-destructive bg-muted px-5 py-5 outline-none"
          >
            <h2 className="text-lg font-semibold text-destructive">
              There is a problem
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
            Registration number
          </label>
          <p id="registrationNumber-hint" className={hintClassName}>
            You received this when you filed the complaint
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
              setChecked(false);
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
            className="h-12 rounded-md px-6 text-base"
            disabled={loading}
          >
            {loading ? "Checking…" : "Track complaint"}
          </Button>
        </div>
      </form>

      {checked && complaint ? (
        <section
          aria-labelledby="status-heading"
          className="mt-10 border-t border-border pt-10"
        >
          <h2 id="status-heading" className="text-xl font-semibold">
            Complaint status
          </h2>
          <p className="mt-2 text-base leading-7 text-foreground">
            Registration number{" "}
            <span className="font-semibold">
              {complaint.registrationNumber}
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-base leading-7 text-foreground">
            <span className="font-semibold">Current status:</span>{" "}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                complaint.status,
              )}`}
            >
              {complaint.status}
            </span>
          </p>
          {complaint.department ? (
            <p className="mt-1 text-base leading-7 text-foreground">
              <span className="font-semibold">Department:</span>{" "}
              {complaint.department}
            </p>
          ) : null}
          {complaint.subject ? (
            <p className="mt-1 text-base leading-7 text-foreground">
              <span className="font-semibold">Summary:</span>{" "}
              {complaint.subject}
            </p>
          ) : null}

          <ol className="mt-8 space-y-6">
            {complaint.history.map((entry) => (
              <li key={String(entry._id)}>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
                    entry.status,
                  )}`}
                >
                  {entry.status}
                </span>
                {entry.note ? (
                  <p className="mt-1 text-base leading-7 text-foreground">
                    {entry.note}
                  </p>
                ) : (
                  <p className="mt-1 text-base leading-7 text-muted-foreground">
                    Waiting for an update
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(entry.at)}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
