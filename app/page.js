import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "CPGRAMS — File or track a government complaint",
  description:
    "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
};

export default function Home() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <section aria-labelledby="hero-heading" className="pb-12">
        <h1
          id="hero-heading"
          className="max-w-xl text-3xl font-semibold tracking-tight text-pretty sm:text-4xl sm:leading-tight"
        >
          Lodge a complaint about a government service
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-foreground">
          Use this website to tell a government department about a problem. You
          can also check the status of a complaint you have already filed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/file-complaint" />}
            className="h-12 w-full rounded-md px-6 text-base sm:w-auto"
          >
            File a complaint
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            size="lg"
            render={<Link href="/track" />}
            className="h-12 w-full rounded-md px-6 text-base sm:w-auto"
          >
            Track a complaint
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="how-it-works-heading"
        className="border-t border-border py-12"
      >
        <h2
          id="how-it-works-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          How it works
        </h2>
        <ol className="mt-8 space-y-8">
          <li className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              1
            </span>
            <div>
              <h3 className="text-lg font-semibold">File your complaint</h3>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Tell us what went wrong and which department it is about.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              2
            </span>
            <div>
              <h3 className="text-lg font-semibold">
                Get a registration number
              </h3>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Keep this number safe. You will need it to track your complaint.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              3
            </span>
            <div>
              <h3 className="text-lg font-semibold">Track the progress</h3>
              <p className="mt-1 text-base leading-7 text-muted-foreground">
                Check what the department has done and whether they have
                replied.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section
        aria-labelledby="important-heading"
        className="border-t border-border py-12"
      >
        <h2
          id="important-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Important information
        </h2>
        <div className="mt-6 border-l-4 border-primary bg-muted px-5 py-5">
          <p className="text-base font-semibold">
            Do not use this in an emergency
          </p>
          <p className="mt-2 text-base leading-7 text-foreground">
            If you need urgent help, call 112. CPGRAMS is for complaints about
            government services, not for accidents, crime in progress, or
            medical emergencies.
          </p>
        </div>
        <ul className="mt-8 list-disc space-y-3 pl-5 text-base leading-7 text-foreground">
          <li>This service is free of charge.</li>
          <li>
            You will need a mobile number or email address to file a complaint.
          </li>
          <li>You can track a complaint using your registration number.</li>
          <li>
            If you are not sure which department to choose, you can still file
            the complaint and it will be sent to the right office.
          </li>
        </ul>
      </section>
    </main>
  );
}
