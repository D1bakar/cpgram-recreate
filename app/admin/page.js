import { AdminDashboard } from "./admin-dashboard";

export const metadata = {
  title: "Complaints — CPGRAMS admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
