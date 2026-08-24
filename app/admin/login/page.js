import { AdminLoginForm } from "./login-form";

export const metadata = {
  title: "Admin sign in — CPGRAMS",
  description: "Restricted area. Sign in to manage complaints.",
};

export default function AdminLoginPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:px-6 sm:py-14"
    >
      <h1 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
        Admin sign in
      </h1>
      <p className="mt-5 text-base leading-7 text-muted-foreground">
        This area is for authorised staff only.
      </p>
      <div className="mt-10">
        <AdminLoginForm />
      </div>
    </main>
  );
}
