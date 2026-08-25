"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  errorClassName,
  fieldClassName,
  hintClassName,
  labelClassName,
} from "@/lib/form-styles";

const CATEGORY_KEYS = [
  "service_delay",
  "service_quality",
  "pension_benefits",
  "documents",
  "corruption",
  "other",
];

const DEPARTMENT_KEYS = [
  "unsure",
  "darpg",
  "home",
  "railways",
  "health",
  "posts",
  "uidai",
  "other",
];

const emptyForm = {
  fullName: "",
  mobile: "",
  email: "",
  category: "",
  department: "",
  subject: "",
  details: "",
};

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

function isValidMobile(value) {
  return /^[6-9]\d{9}$/.test(value.replaceAll(" ", ""));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function FileComplaintForm() {
  const t = useTranslations("fileComplaint");
  const tv = useTranslations("validation");
  const locale = useLocale();
  const errorSummaryId = useId();
  const [values, setValues] = useState(emptyForm);
  const [files, setFiles] = useState([]);
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

    if (!nextValues.fullName.trim()) nextErrors.fullName = tv("fullName");
    if (!nextValues.mobile.trim()) nextErrors.mobile = tv("mobile");
    else if (!isValidMobile(nextValues.mobile))
      nextErrors.mobile = tv("mobileInvalid");
    if (!nextValues.email.trim()) nextErrors.email = tv("email");
    else if (!isValidEmail(nextValues.email))
      nextErrors.email = tv("emailInvalid");
    if (!nextValues.category) nextErrors.category = tv("category");
    if (!nextValues.department) nextErrors.department = tv("department");
    if (!nextValues.subject.trim()) nextErrors.subject = tv("subject");
    if (!nextValues.details.trim()) nextErrors.details = tv("details");
    else if (nextValues.details.trim().length < 20)
      nextErrors.details = tv("detailsShort");

    return nextErrors;
  }

  function handleFiles(event) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    const nextErrors = { ...errors };
    delete nextErrors.documents;

    const merged = [...files];
    for (const file of selected) {
      if (merged.length >= MAX_FILES) {
        nextErrors.documents = tv("documentsTooMany");
        break;
      }
      if (!ALLOWED_TYPES.has(file.type)) {
        nextErrors.documents = tv("documentsType");
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        nextErrors.documents = tv("documentsTooLarge");
        continue;
      }
      merged.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
      });
    }

    setFiles(merged);
    setErrors(nextErrors);
  }

  function handleContinue(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      document.getElementById(errorSummaryId)?.focus();
      return;
    }
    setApiError("");
    setSubmitted(true);
  }

  async function handleSubmitComplaint() {
    setSubmitting(true);
    setApiError("");
    try {
      const departmentLabel = t(`departments.${values.department}`);
      const categoryLabel = t(`categories.${values.category}`);
      const payload = {
        fullName: values.fullName.trim(),
        mobile: values.mobile.trim(),
        email: values.email.trim(),
        department: departmentLabel,
        subject: values.subject.trim(),
        details: [
          `Category: ${categoryLabel}`,
          values.details.trim(),
          files.length
            ? `Attached files (names only): ${files.map((f) => f.name).join(", ")}`
            : null,
        ]
          .filter(Boolean)
          .join("\n\n"),
      };

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setApiError(t("apiError"));
    } catch {
      setApiError(t("apiError"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setResult(null);
    setSubmitted(false);
    setValues(emptyForm);
    setFiles([]);
    setErrors({});
    setApiError("");
  }

  const stepLabel = result
    ? t("progress_done")
    : submitted
      ? t("progress_review")
      : t("progress_details");

  if (result) {
    return (
      <div>
        <p className="mb-6 font-mono text-sm text-muted-foreground">{stepLabel}</p>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-xl font-medium">{t("successTitle")}</h2>
          <p className="mt-2 text-base leading-7 text-foreground">
            {t("successIntro")}
          </p>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            {t("successLabel")}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {result.registrationNumber}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link
                  href={`/${locale}/track?ref=${encodeURIComponent(
                    result.registrationNumber,
                  )}`}
                />
              }
              className="h-12 px-6 text-base"
            >
              {t("trackCta")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 px-6 text-base"
              onClick={resetAll}
            >
              {t("another")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div>
        <p className="mb-6 font-mono text-sm text-muted-foreground">{stepLabel}</p>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-xl font-medium">{t("reviewTitle")}</h2>
          <p className="mt-2 text-base leading-7 text-foreground">
            {t("reviewIntro")}
          </p>
          <dl className="mt-6 space-y-4 text-base">
            {[
              [t("labelName"), values.fullName],
              [t("labelMobile"), values.mobile],
              [t("labelEmail"), values.email],
              [t("labelCategory"), t(`categories.${values.category}`)],
              [t("labelDepartment"), t(`departments.${values.department}`)],
              [t("labelSubject"), values.subject],
              [t("labelDetails"), values.details],
              [
                t("labelDocuments"),
                files.length
                  ? files.map((f) => f.name).join(", ")
                  : t("documentsEmpty"),
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold">{label}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {apiError ? (
            <p className="mt-6 text-base font-medium text-destructive">
              {apiError}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              className="h-12 px-6 text-base"
              disabled={submitting}
              onClick={handleSubmitComplaint}
            >
              {submitting ? t("submitting") : t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 px-6 text-base"
              disabled={submitting}
              onClick={() => setSubmitted(false)}
            >
              {t("change")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <div>
      <p className="mb-6 font-mono text-sm text-muted-foreground">{stepLabel}</p>
      <form onSubmit={handleContinue} noValidate>
        {errorList.length > 0 ? (
          <div
            id={errorSummaryId}
            tabIndex={-1}
            className="mb-8 rounded-3xl border border-destructive/40 bg-card px-5 py-5 outline-none"
          >
            <h2 className="text-lg font-semibold text-destructive">
              {t("errorTitle")}
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
              {t("fullName")}
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
              {t("mobile")}
            </label>
            <p id="mobile-hint" className={hintClassName}>
              {t("mobileHint")}
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
              {t("email")}
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
            <label htmlFor="category" className={labelClassName}>
              {t("category")}
            </label>
            <p id="category-hint" className={hintClassName}>
              {t("categoryHint")}
            </p>
            <select
              id="category"
              name="category"
              value={values.category}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category
                  ? "category-hint category-error"
                  : "category-hint"
              }
              className={fieldClassName}
              onChange={(event) => update("category", event.target.value)}
            >
              <option value="">{t("categoryPlaceholder")}</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`categories.${key}`)}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p id="category-error" className={errorClassName}>
                {errors.category}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="department" className={labelClassName}>
              {t("department")}
            </label>
            <p id="department-hint" className={hintClassName}>
              {t("departmentHint")}
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
              <option value="">{t("departmentPlaceholder")}</option>
              {DEPARTMENT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`departments.${key}`)}
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
              {t("subject")}
            </label>
            <p id="subject-hint" className={hintClassName}>
              {t("subjectHint")}
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
              {t("details")}
            </label>
            <p id="details-hint" className={hintClassName}>
              {t("detailsHint")}
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

          <div>
            <label htmlFor="documents" className={labelClassName}>
              {t("documents")}
            </label>
            <p id="documents-hint" className={hintClassName}>
              {t("documentsHint")}
            </p>
            <input
              id="documents"
              name="documents"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              aria-describedby={
                errors.documents
                  ? "documents-hint documents-error"
                  : "documents-hint"
              }
              className="mt-2 block w-full text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
              onChange={handleFiles}
            />
            {files.length ? (
              <ul className="mt-3 space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="shrink-0 text-clay underline-offset-4 hover:underline"
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((item) => item.id !== file.id),
                        )
                      }
                    >
                      {t("documentsRemove")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("documentsEmpty")}
              </p>
            )}
            {errors.documents ? (
              <p id="documents-error" className={errorClassName}>
                {errors.documents}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-10">
          <Button type="submit" size="lg" className="h-12 px-6 text-base">
            {t("continue")}
          </Button>
        </div>
      </form>
    </div>
  );
}
