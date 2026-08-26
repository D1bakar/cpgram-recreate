import { readJson } from "@/lib/read-json";

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
      window.location.assign("/admin/login");
      const error = new Error("Session expired");
      error.code = 401;
      throw error;
    }
  }

  return response;
}

export async function adminJson(url, options = {}) {
  const response = await adminFetch(url, options);
  const data = await readJson(response);
  return { response, data };
}
