"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { adminJson } from "@/lib/admin-fetch";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminDashboard() {
  const t = useTranslations("admin");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { response, data } = await adminJson("/api/admin/complaints");
      if (!response.ok) {
        setError(response.status === 403 ? t("forbidden") : t("loadError"));
        return;
      }
      setComplaints(Array.isArray(data?.complaints) ? data.complaints : []);
    } catch (caught) {
      if (caught?.code === 401) return;
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Still leave the admin area; the session cookie is httpOnly.
    }
    window.location.assign("/admin/login");
  }

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
          {t("complaintsTitle")}
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          {t("signOut")}
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 text-muted-foreground" aria-live="polite">
          {t("loading")}
        </p>
      ) : error ? (
        <div className="mt-8">
          <p className="text-destructive" role="alert">
            {error}
          </p>
          <Button className="mt-4" variant="outline" onClick={load}>
            {t("retry")}
          </Button>
        </div>
      ) : complaints.length === 0 ? (
        <p className="mt-8 text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mt-8 -mx-4 overflow-x-auto border-y border-border sm:mx-0 sm:border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  {t("colRegistration")}
                </th>
                <th className="px-4 py-3 font-semibold">{t("colName")}</th>
                <th className="px-4 py-3 font-semibold">
                  {t("colDepartment")}
                </th>
                <th className="px-4 py-3 font-semibold">{t("colStatus")}</th>
                <th className="px-4 py-3 font-semibold">{t("colFiled")}</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/complaints/${complaint._id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {complaint.registrationNumber}
                    </a>
                  </td>
                  <td className="px-4 py-3">{complaint.fullName}</td>
                  <td className="px-4 py-3">{complaint.department}</td>
                  <td className="px-4 py-3">{complaint.status}</td>
                  <td className="px-4 py-3">
                    {formatDate(complaint.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
