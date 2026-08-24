import { TrackComplaintForm } from "./track-complaint-form";

export const metadata = {
  title: "Track a complaint — CPGRAMS",
  description:
    "Check the status of a complaint using your registration number.",
};

export default function TrackComplaintPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
        Track a complaint
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-foreground">
        Enter the registration number you received when you filed the complaint.
      </p>
      <div className="mt-10">
        <TrackComplaintForm />
      </div>
    </main>
  );
}
