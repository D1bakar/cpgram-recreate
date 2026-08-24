"use client";

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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Government of India
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
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
            className="flex flex-wrap items-center gap-1"
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
        </div>
      </div>
    </header>
  );
}
