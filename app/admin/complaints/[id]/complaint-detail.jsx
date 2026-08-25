"use client";

import { useCallback, useEffect, useState } from "react";

import { StatusTimeline } from "@/components/status-timeline";
import { Button } from "@/components/ui/button";

import { adminFetch } from "@/lib/admin-fetch";

const STATUSES = ["Received", "Under Review", "Resolved", "Rejected"];

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ComplaintDetail({ complaintId }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await adminFetch(`/api/admin/complaints/${complaintId}`);
      const data = await response.json();
      if (!response.ok) {
        setError("Could not load complaint");
        return;
      }
      setComplaint(data.complaint);
      setStatus(data.complaint.status);
    } catch {
      setError("Could not load complaint");
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await adminFetch(
        `/api/admin/complaints/${complaintId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note }),
        },
      );
      if (!response.ok) {
        setError("Could not update status");
        return;
      }
      setNote("");
      await load();
    } catch {
      setError("Could not update status");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main id="main-content" className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (error && !complaint) {
    return (
      <main id="main-content" className="px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-destructive">{error}</p>
        <a href="/admin" className="mt-4 inline-block underline">
          Back to complaints
        </a>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <a
        href="/admin"
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        ← Back to complaints
      </a>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
        {complaint.registrationNumber}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        Filed {formatDate(complaint.createdAt)}
      </p>

      {error ? <p className="mt-6 text-destructive">{error}</p> : null}

      <dl className="mt-8 space-y-4 text-base">
        <div>
          <dt className="font-semibold">Name</dt>
          <dd className="mt-1 text-foreground">{complaint.fullName}</dd>
        </div>
        <div>
          <dt className="font-semibold">Mobile</dt>
          <dd className="mt-1 text-foreground">{complaint.mobile}</dd>
        </div>
        <div>
          <dt className="font-semibold">Email</dt>
          <dd className="mt-1 text-foreground">{complaint.email}</dd>
        </div>
        <div>
          <dt className="font-semibold">Department</dt>
          <dd className="mt-1 text-foreground">{complaint.department}</dd>
        </div>
        <div>
          <dt className="font-semibold">Summary</dt>
          <dd className="mt-1 text-foreground">{complaint.subject}</dd>
        </div>
        <div>
          <dt className="font-semibold">Details</dt>
          <dd className="mt-1 whitespace-pre-wrap text-foreground">
            {complaint.details}
          </dd>
        </div>
      </dl>

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="history-heading"
      >
        <h2 id="history-heading" className="text-xl font-semibold">
          Status timeline
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
          Update status
        </h2>
        <form onSubmit={handleUpdate} className="mt-4 space-y-6">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              New status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-base"
            >
              {STATUSES.map((option) => (
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
              Note (optional)
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
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Update status"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
