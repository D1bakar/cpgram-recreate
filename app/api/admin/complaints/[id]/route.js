import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { sendEmail, renderEmailHtml } from "@/lib/email";
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
    Received: ["Under Review", "Resolved", "Rejected"],
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

  const statusChanged = status !== from;
  if (statusChanged || note.trim()) {
    const origin = (() => {
      try {
        return new URL(request.url).origin;
      } catch {
        return process.env.APP_URL || "";
      }
    })();
    try {
      const trackUrl = origin
        ? `${origin}/track?ref=${encodeURIComponent(complaint.registrationNumber)}`
        : null;
      const fields = [["Reference number", complaint.registrationNumber]];
      if (note.trim()) fields.push(["Note from department", note.trim()]);
      await sendEmail({
        to: complaint.email,
        subject: `Update on your grievance ${complaint.registrationNumber}: ${status}`,
        text: [
          `Dear ${complaint.fullName},`,
          "",
          `Your grievance ${complaint.registrationNumber} has been updated.`,
          `New status: ${status}`,
          note.trim() ? `Note from the department: ${note.trim()}` : "",
          "",
          trackUrl
            ? `Track it here: ${trackUrl}`
            : `Use your reference number to track this complaint.`,
          "",
          "Regards,",
          "CPGRAMS Team",
        ]
          .filter(Boolean)
          .join("\n"),
        html: renderEmailHtml({
          preheader: `Your grievance ${complaint.registrationNumber} is now ${status}.`,
          heading: "Status updated",
          greeting: `Dear ${complaint.fullName},`,
          message: `Your grievance ${complaint.registrationNumber} has been updated.`,
          badge: status,
          fields,
          cta: trackUrl
            ? { href: trackUrl, text: "Track your complaint" }
            : null,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }
  }

  return NextResponse.json({ complaint });
}
