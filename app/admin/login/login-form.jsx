"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { fieldClassName, labelClassName } from "@/lib/form-styles";

export function AdminLoginForm() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ accessCode, password }),
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      if (response.status === 401) {
        setError("Invalid access code or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error ? (
        <div className="border-l-4 border-destructive bg-muted px-5 py-5">
          <p className="text-base font-medium text-destructive">{error}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="accessCode" className={labelClassName}>
          Access code
        </label>
        <input
          id="accessCode"
          name="accessCode"
          autoComplete="off"
          value={accessCode}
          className={fieldClassName}
          onChange={(event) => setAccessCode(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClassName}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          className={fieldClassName}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div>
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-md px-6 text-base"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
