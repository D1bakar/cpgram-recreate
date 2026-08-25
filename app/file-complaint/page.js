import { Eyebrow } from "@/components/eyebrow";
import { FileComplaintForm } from "./file-complaint-form";

export const metadata = {
  title: "File a complaint — CPGRAMS",
  description:
    "Tell a government department about a problem with a public service.",
};

export default function FileComplaintPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <Eyebrow>File a complaint</Eyebrow>
      <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-pretty text-gray sm:text-4xl">
        File a complaint
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-foreground">
        Tell us what went wrong. This service is free. Do not use it in an
        emergency — call 112.
      </p>
      <div className="mt-10">
        <FileComplaintForm />
      </div>
    </main>
  );
}
