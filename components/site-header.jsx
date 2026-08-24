"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/file-complaint", label: "File a complaint" },
  { href: "/track", label: "Track a complaint" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="border-b border-border bg-muted">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <p className="text-sm text-foreground">Government of India</p>
          <p className="text-sm text-muted-foreground">Official website</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Department of Administrative Reforms and Public Grievances
          </p>
          <Link
            href="/"
            className="mt-1 inline-block text-2xl font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            CPGRAMS
          </Link>
          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            Centralised Public Grievance Redress and Monitoring System
          </p>
        </div>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => {
            const isCurrent = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring aria-[current=page]:underline"
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
