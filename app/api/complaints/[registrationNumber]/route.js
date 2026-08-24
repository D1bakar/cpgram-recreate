import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";

export async function GET(request, { params }) {
  const { registrationNumber } = await params;
  const normalized = String(registrationNumber ?? "")
    .trim()
    .toUpperCase();

  if (!normalized) {
    return NextResponse.json(
      { error: "Registration number is required" },
      { status: 400 },
    );
  }

  await connectDB();
  const complaint = await Complaint.findOne({
    registrationNumber: normalized,
  })
    .select(
      "registrationNumber department subject status createdAt updatedAt history",
    )
    .lean();

  if (!complaint) {
    return NextResponse.json(
      { error: "No complaint found with that registration number" },
      { status: 404 },
    );
  }

  return NextResponse.json({ complaint });
}
