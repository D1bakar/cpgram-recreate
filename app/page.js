import Link from "next/link";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "CPGRAMS — File or track a government complaint",
  description:
    "File a complaint with a government department, or track a complaint you have already lodged. This service is free.",
};

const steps = [
  {
    title: "File your complaint",
    body: "Tell us what went wrong and which department it is about.",
  },
  {
    title: "Get a registration number",
    body: "Keep this number safe. You will need it to track your complaint.",
  },
  {
    title: "Track the progress",
    body: "Check what the department has done and whether they have replied.",
  },
];

const notes = [
  "This service is free of charge.",
  "You will need a mobile number or email address to file a complaint.",
  "You can track a complaint using your registration number.",
  "If you are not sure which department to choose, you can still file the complaint and it will be sent to the right office.",
];

export default function Home() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 sm:py-24"
    >
      <section className="max-w-2xl">
        <Eyebrow>Public Grievance Portal</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Lodge a complaint about a government service
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          Tell a government department about a problem with a public service,
          then track its progress with the registration number you receive.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            render={<Link href="/file-complaint" />}
            className="h-12 px-6 text-base"
          >
            File a complaint
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/track" />}
            className="h-12 px-6 text-base"
          >
            Track a complaint
          </Button>
        </div>
      </section>

      <section className="mt-20 border-t border-border pt-16">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Three steps to redress
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="font-mono text-sm text-[#6798ff]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <Eyebrow>Important</Eyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Before you begin
        </h2>
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-sm leading-6 text-foreground"
              >
                <span aria-hidden="true" className="mt-1 text-[#6798ff]">
                  →
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
