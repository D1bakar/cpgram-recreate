import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const complaints = await Complaint.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ complaints });
}
