"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { fieldClassName, labelClassName } from "@/lib/form-styles";
import { readJson } from "@/lib/read-json";

export function AdminLoginForm() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitLock.current) return;

    if (!accessCode.trim()) {
      setError(t("accessCodeRequired"));
      return;
    }
    if (!password) {
      setError(t("passwordRequired"));
      return;
    }

    submitLock.current = true;
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ accessCode, password }),
      });
      await readJson(response);

      if (response.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      if (response.status === 401) {
        setError(t("invalidCredentials"));
      } else {
        setError(t("loginFailed"));
      }
    } catch {
      setError(t("loginFailed"));
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error ? (
        <div
          className="border-l-4 border-destructive bg-muted px-5 py-5"
          role="alert"
        >
          <p className="text-base font-medium text-destructive">{error}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="accessCode" className={labelClassName}>
          {t("accessCode")}
        </label>
        <input
          id="accessCode"
          name="accessCode"
          autoComplete="username"
          required
          aria-invalid={Boolean(error)}
          value={accessCode}
          className={fieldClassName}
          onChange={(event) => setAccessCode(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClassName}>
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(error)}
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
          aria-busy={submitting}
        >
          {submitting ? t("signingIn") : t("signIn")}
        </Button>
      </div>
    </form>
  );
}
