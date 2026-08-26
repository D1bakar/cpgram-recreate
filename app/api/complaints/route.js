import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";

function isMobile(value) {
  return /^[6-9]\d{9}$/.test(String(value).replaceAll(" ", ""));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

function generateRegistrationNumber() {
  const year = new Date().getFullYear();
  const random = Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 32)),
  ).join("");
  return `CPG-${year}-${random}`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const fullName = String(body?.fullName ?? "").trim();
  const mobile = String(body?.mobile ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const department = String(body?.department ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const details = String(body?.details ?? "").trim();
  const rawMedia = Array.isArray(body?.media) ? body.media : [];
  const media = rawMedia
    .filter(
      (item) =>
        item && typeof item.url === "string" && item.url.trim().length > 0,
    )
    .slice(0, 10)
    .map((item) => ({
      url: String(item.url).trim(),
      publicId: item.publicId ? String(item.publicId) : null,
      name: item.name ? String(item.name) : "",
      bytes: Number.isFinite(item.bytes) ? item.bytes : 0,
      type: item.type ? String(item.type) : "",
    }));

  const errors = {};
  if (!fullName) errors.fullName = "Enter your full name";
  if (!isMobile(mobile))
    errors.mobile = "Enter a valid 10-digit Indian mobile number";
  if (!isEmail(email)) errors.email = "Enter a valid email address";
  if (!department) errors.department = "Choose a department";
  if (!subject) errors.subject = "Enter a short summary";
  if (details.length < 20)
    errors.details = "Give more detail so the department can help you";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    await connectDB();
    const registrationNumber = generateRegistrationNumber();
    const complaint = await Complaint.create({
      registrationNumber,
      fullName,
      mobile,
      email,
      department,
      subject,
      details,
      media,
      status: "Received",
      history: [{ status: "Received", note: "Complaint received" }],
    });
    return NextResponse.json(
      { registrationNumber: complaint.registrationNumber },
      { status: 201 },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "Could not register, please try again" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Could not save complaint" },
      { status: 500 },
    );
  }
}
