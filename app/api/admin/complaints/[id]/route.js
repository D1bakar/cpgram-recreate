import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { COMPLAINT_STATUSES, Complaint } from "@/lib/models/Complaint";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

async function requireAdmin(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function GET(request, { params }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const complaint = await Complaint.findById(id).lean();
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ complaint });
}

export async function PATCH(request, { params }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const status = String(body?.status ?? "").trim();
  const note = String(body?.note ?? "").trim();

  if (!COMPLAINT_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { id } = await params;
  await connectDB();
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed = {
    Received: ["Under Review"],
    "Under Review": ["Resolved", "Rejected"],
    Resolved: [],
    Rejected: [],
  };
  const from = complaint.status;
  if (status !== from && !(allowed[from] ?? []).includes(status)) {
    return NextResponse.json(
      {
        error: `Cannot change status from ${from} to ${status}`,
      },
      { status: 400 },
    );
  }

  complaint.status = status;
  complaint.history.push({ status, note });
  await complaint.save();

  return NextResponse.json({ complaint });
}
