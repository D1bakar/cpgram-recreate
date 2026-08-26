import { ComplaintDetail } from "./complaint-detail";

export default async function ComplaintPage({ params }) {
  const { id } = await params;
  return <ComplaintDetail complaintId={id} />;
}
