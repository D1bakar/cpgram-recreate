"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/file-complaint", label: "File a complaint" },
  { href: "/track", label: "Track a complaint" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur transition-colors duration-300 ${
        open ? "bg-background/70" : "bg-background/80"
      }`}
    >
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Government of India
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:block">
            Official website
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="rounded-sm text-xl font-semibold tracking-tight text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          CPGRAMS
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Primary"
            className="hidden flex-wrap items-center gap-1 md:flex"
          >
            {links.map((link) => {
              const isCurrent =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring ${
                    isCurrent
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-foreground transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-border transition-all duration-300 md:hidden ${
          open ? "max-h-64 border-t" : "max-h-0"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3 sm:px-6"
        >
          {links.map((link) => {
            const isCurrent =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent ? "page" : undefined}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring ${
                  isCurrent
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
