import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-foreground">
          Government of India
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          CPGRAMS is the Centralised Public Grievance Redress and Monitoring
          System of the Department of Administrative Reforms and Public
          Grievances.
        </p>
        <nav
          aria-label="Footer"
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2"
        >
          <Link
            href="/file-complaint"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            File a complaint
          </Link>
          <Link
            href="/track"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            Track a complaint
          </Link>
        </nav>
      </div>
    </footer>
  );
}
