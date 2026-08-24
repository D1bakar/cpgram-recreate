"use client";

export async function adminFetch(url, options = {}) {
  const doFetch = () => fetch(url, { credentials: "same-origin", ...options });

  let response = await doFetch();

  if (response.status === 401) {
    const refreshed = await fetch("/api/admin/refresh", {
      method: "POST",
      credentials: "same-origin",
    });
    if (refreshed.ok) {
      response = await doFetch();
    } else {
      window.location.href = "/admin/login";
      throw new Error("Session expired");
    }
  }

  return response;
}
