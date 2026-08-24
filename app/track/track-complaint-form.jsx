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

export function TrackComplaintForm() {
  const errorSummaryId = useId();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!registrationNumber.trim()) {
      setError("Enter your registration number");
      setChecked(false);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    if (!isValidRegistration(registrationNumber)) {
      setError("Enter a registration number between 6 and 20 characters");
      setChecked(false);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    setError("");
    setChecked(true);
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
          >
            Track complaint
          </Button>
        </div>
      </form>

      {checked ? (
        <section
          aria-labelledby="status-heading"
          className="mt-10 border-t border-border pt-10"
        >
          <h2 id="status-heading" className="text-xl font-semibold">
            Complaint status
          </h2>
          <p className="mt-2 text-base leading-7 text-foreground">
            Registration number{" "}
            <span className="font-semibold">{registrationNumber.trim()}</span>
          </p>
          <ol className="mt-8 space-y-6">
            <li>
              <p className="font-semibold">Received</p>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Waiting for an update
              </p>
            </li>
            <li>
              <p className="font-semibold">Being looked at</p>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Waiting for an update
              </p>
            </li>
            <li>
              <p className="font-semibold">Reply</p>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Waiting for an update
              </p>
            </li>
          </ol>
        </section>
      ) : null}
    </div>
  );
}
