"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { StatusTimeline } from "@/components/status-timeline";
import { Button } from "@/components/ui/button";
import { adminJson } from "@/lib/admin-fetch";
import { STATUS_TRANSITIONS } from "@/lib/complaint-labels";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ComplaintDetail({ complaintId }) {
  const t = useTranslations("admin");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);

  const load = useCallback(async () => {
    try {
      const { response, data } = await adminJson(
        `/api/admin/complaints/${complaintId}`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError(t("notFound"));
        } else if (response.status === 403) {
          setError(t("forbidden"));
        } else {
          setError(t("loadComplaintError"));
        }
        return;
      }
      if (!data?.complaint) {
        setError(t("loadComplaintError"));
        return;
      }
      setComplaint(data.complaint);
      setStatus(data.complaint.status);
      setError("");
    } catch (caught) {
      if (caught?.code === 401) return;
      setError(t("loadComplaintError"));
    } finally {
      setLoading(false);
    }
  }, [complaintId, t]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function handleUpdate(event) {
    event.preventDefault();
    if (saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    setError("");
    try {
      const { response, data } = await adminJson(
        `/api/admin/complaints/${complaintId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note }),
        },
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError(t("notFound"));
        } else if (typeof data?.error === "string" && data.error) {
          setError(data.error);
        } else {
          setError(t("updateError"));
        }
        return;
      }
      if (data?.complaint) {
        setComplaint(data.complaint);
        setStatus(data.complaint.status);
        setNote("");
        return;
      }
      setNote("");
      await load();
    } catch (caught) {
      if (caught?.code === 401) return;
      setError(t("updateError"));
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main id="main-content" className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-muted-foreground" aria-live="polite">
          {t("loading")}
        </p>
      </main>
    );
  }

  if (error && !complaint) {
    return (
      <main id="main-content" className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-destructive" role="alert">
          {error}
        </p>
        <a href="/admin" className="mt-4 inline-block underline">
          {t("back")}
        </a>
      </main>
    );
  }

  const allowedStatuses = STATUS_TRANSITIONS[complaint.status] ?? [
    complaint.status,
  ];
  const filedDate = formatDate(complaint.createdAt);

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <a
        href="/admin"
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        ← {t("back")}
      </a>

      <h1 className="mt-4 break-all text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
        {complaint.registrationNumber}
      </h1>
      {filedDate ? (
        <p className="mt-2 text-base text-muted-foreground">
          {t("filed", { date: filedDate })}
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <dl className="mt-8 space-y-4 text-base">
        <div>
          <dt className="font-semibold">{t("name")}</dt>
          <dd className="mt-1 break-words text-foreground">
            {complaint.fullName}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("mobile")}</dt>
          <dd className="mt-1 text-foreground">{complaint.mobile}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("email")}</dt>
          <dd className="mt-1 break-all text-foreground">{complaint.email}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("department")}</dt>
          <dd className="mt-1 break-words text-foreground">
            {complaint.department}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("summary")}</dt>
          <dd className="mt-1 break-words text-foreground">
            {complaint.subject}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("details")}</dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-foreground">
            {complaint.details}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("attachments")}</dt>
          <dd className="mt-1 text-foreground">
            {complaint.media?.length ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {complaint.media.map((item) => (
                  <li key={item.url} className="flex flex-col gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block overflow-hidden rounded-lg border border-border bg-card"
                    >
                      <img
                        src={item.url}
                        alt={item.name || t("attachments")}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    </a>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="truncate text-sm font-medium underline-offset-4 hover:underline"
                      title={item.name}
                    >
                      {item.name || item.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">{t("noAttachments")}</span>
            )}
          </dd>
        </div>
      </dl>

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="history-heading"
      >
        <h2 id="history-heading" className="text-xl font-semibold">
          {t("history")}
        </h2>
        <div className="mt-4">
          <StatusTimeline complaint={complaint} />
        </div>
      </section>

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="update-heading"
      >
        <h2 id="update-heading" className="text-xl font-semibold">
          {t("update")}
        </h2>
        <form onSubmit={handleUpdate} className="mt-4 space-y-6">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              {t("newStatus")}
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-base"
            >
              {allowedStatuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-foreground"
            >
              {t("note")}
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-base"
            />
          </div>
          <div>
            <Button type="submit" disabled={saving} aria-busy={saving}>
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
