"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  errorClassName,
  fieldClassName,
  hintClassName,
  labelClassName,
} from "@/lib/form-styles";

const departments = [
  "I am not sure",
  "Department of Administrative Reforms and Public Grievances",
  "Ministry of Home Affairs",
  "Ministry of Railways",
  "Ministry of Health and Family Welfare",
  "Department of Posts",
  "Unique Identification Authority of India (UIDAI)",
  "Other department",
];

const emptyForm = {
  fullName: "",
  mobile: "",
  email: "",
  department: "",
  subject: "",
  details: "",
};

function isValidMobile(value) {
  return /^[6-9]\d{9}$/.test(value.replaceAll(" ", ""));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function FileComplaintForm() {
  const errorSummaryId = useId();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validate(nextValues) {
    const nextErrors = {};

    if (!nextValues.fullName.trim()) {
      nextErrors.fullName = "Enter your full name";
    }

    if (!nextValues.mobile.trim()) {
      nextErrors.mobile = "Enter a 10-digit mobile number";
    } else if (!isValidMobile(nextValues.mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit Indian mobile number";
    }

    if (!nextValues.email.trim()) {
      nextErrors.email = "Enter an email address";
    } else if (!isValidEmail(nextValues.email)) {
      nextErrors.email = "Enter an email address in the correct format";
    }

    if (!nextValues.department) {
      nextErrors.department = "Choose a department";
    }

    if (!nextValues.subject.trim()) {
      nextErrors.subject = "Enter a short summary of your complaint";
    }

    if (!nextValues.details.trim()) {
      nextErrors.details = "Describe what happened";
    } else if (nextValues.details.trim().length < 20) {
      nextErrors.details = "Give more detail so the department can help you";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }

    setSubmitted(true);
  }

  async function handleSubmitComplaint() {
    setSubmitting(true);
    setApiError("");
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setResult({ registrationNumber: data.registrationNumber });
        return;
      }
      if (data?.errors) {
        setErrors(data.errors);
        setSubmitted(false);
        document.getElementById(errorSummaryId)?.focus();
        return;
      }
      setApiError("Something went wrong. Please try again.");
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="border-l-4 border-primary bg-muted px-5 py-6">
        <h2 className="text-xl font-semibold">
          Your complaint has been registered
        </h2>
        <p className="mt-2 text-base leading-7 text-foreground">
          Keep this registration number safe. You will need it to track your
          complaint.
        </p>
        <p className="mt-4 text-lg font-semibold">
          {result.registrationNumber}
        </p>
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-md px-6 text-base"
            onClick={() => {
              setResult(null);
              setSubmitted(false);
              setValues(emptyForm);
              setErrors({});
            }}
          >
            File another complaint
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="border-l-4 border-primary bg-muted px-5 py-6">
        <h2 className="text-xl font-semibold">Check your answers</h2>
        <p className="mt-2 text-base leading-7 text-foreground">
          Check these details. You can go back and file another complaint if
          something is wrong.
        </p>
        <dl className="mt-6 space-y-4 text-base">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd className="mt-1 text-foreground">{values.fullName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Mobile</dt>
            <dd className="mt-1 text-foreground">{values.mobile}</dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd className="mt-1 text-foreground">{values.email}</dd>
          </div>
          <div>
            <dt className="font-semibold">Department</dt>
            <dd className="mt-1 text-foreground">{values.department}</dd>
          </div>
          <div>
            <dt className="font-semibold">Summary</dt>
            <dd className="mt-1 text-foreground">{values.subject}</dd>
          </div>
          <div>
            <dt className="font-semibold">Details</dt>
            <dd className="mt-1 whitespace-pre-wrap text-foreground">
              {values.details}
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          {apiError ? (
            <p className="mb-4 text-base font-medium text-destructive">
              {apiError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              className="h-12 rounded-md px-6 text-base"
              disabled={submitting}
              onClick={handleSubmitComplaint}
            >
              {submitting ? "Submitting…" : "Submit complaint"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-md px-6 text-base"
              disabled={submitting}
              onClick={() => {
                setSubmitted(false);
                setValues(emptyForm);
                setErrors({});
              }}
            >
              Change answers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errorList.length > 0 ? (
        <div
          id={errorSummaryId}
          tabIndex={-1}
          className="mb-8 border-l-4 border-destructive bg-muted px-5 py-5 outline-none"
        >
          <h2 className="text-lg font-semibold text-destructive">
            There is a problem
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="font-medium text-destructive underline-offset-4 hover:underline"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-8">
        <div>
          <label htmlFor="fullName" className={labelClassName}>
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            value={values.fullName}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={fieldClassName}
            onChange={(event) => update("fullName", event.target.value)}
          />
          {errors.fullName ? (
            <p id="fullName-error" className={errorClassName}>
              {errors.fullName}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mobile" className={labelClassName}>
            Mobile number
          </label>
          <p id="mobile-hint" className={hintClassName}>
            10 digits, starting with 6, 7, 8 or 9
          </p>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={values.mobile}
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={
              errors.mobile ? "mobile-hint mobile-error" : "mobile-hint"
            }
            className={fieldClassName}
            onChange={(event) => update("mobile", event.target.value)}
          />
          {errors.mobile ? (
            <p id="mobile-error" className={errorClassName}>
              {errors.mobile}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClassName}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? (
            <p id="email-error" className={errorClassName}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="department" className={labelClassName}>
            Department
          </label>
          <p id="department-hint" className={hintClassName}>
            If you are not sure, choose “I am not sure”
          </p>
          <select
            id="department"
            name="department"
            value={values.department}
            aria-invalid={Boolean(errors.department)}
            aria-describedby={
              errors.department
                ? "department-hint department-error"
                : "department-hint"
            }
            className={fieldClassName}
            onChange={(event) => update("department", event.target.value)}
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department ? (
            <p id="department-error" className={errorClassName}>
              {errors.department}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="subject" className={labelClassName}>
            Short summary
          </label>
          <p id="subject-hint" className={hintClassName}>
            For example, “Pension not received for 3 months”
          </p>
          <input
            id="subject"
            name="subject"
            value={values.subject}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={
              errors.subject ? "subject-hint subject-error" : "subject-hint"
            }
            className={fieldClassName}
            onChange={(event) => update("subject", event.target.value)}
          />
          {errors.subject ? (
            <p id="subject-error" className={errorClassName}>
              {errors.subject}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="details" className={labelClassName}>
            What happened
          </label>
          <p id="details-hint" className={hintClassName}>
            Include dates, places and what you have already done
          </p>
          <textarea
            id="details"
            name="details"
            rows={8}
            value={values.details}
            aria-invalid={Boolean(errors.details)}
            aria-describedby={
              errors.details ? "details-hint details-error" : "details-hint"
            }
            className={`${fieldClassName} min-h-40 resize-y`}
            onChange={(event) => update("details", event.target.value)}
          />
          {errors.details ? (
            <p id="details-error" className={errorClassName}>
              {errors.details}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10">
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-md px-6 text-base"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
