import { ComplaintDetail } from "./complaint-detail";

export async function generateMetadata() {
  return {
    title: "Complaint — CPGRAMS admin",
    robots: { index: false, follow: false },
  };
}

export default async function ComplaintPage({ params }) {
  const { id } = await params;
  return <ComplaintDetail complaintId={id} />;
}
