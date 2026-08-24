"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await adminFetch("/api/admin/complaints");
      const data = await response.json();
      if (!response.ok) {
        setError("Could not load complaints");
        return;
      }
      setComplaints(data.complaints ?? []);
    } catch {
      setError("Could not load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    window.location.href = "/admin/login";
  }

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
          Complaints
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          Sign out
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-destructive">{error}</p>
      ) : complaints.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No complaints yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Registration</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Filed</th>
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
