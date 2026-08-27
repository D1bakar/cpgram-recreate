import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Complaint } from "@/lib/models/Complaint";
import {
  constantTimeEqual,
  hashOtp,
  isOtpExpired,
  otpMaxAttempts,
} from "@/lib/otp";

const COMPLAINT_PROJECTION =
  "registrationNumber department subject status createdAt updatedAt history media details";

function isValidRegistration(value) {
  return /^[A-Za-z0-9/-]{6,20}$/.test(String(value).trim());
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const registrationNumber = String(body?.registrationNumber ?? "")
    .trim()
    .toUpperCase();
  const otp = String(body?.otp ?? "").trim();

  if (!isValidRegistration(registrationNumber)) {
    return NextResponse.json(
      { error: "Invalid registration number" },
      { status: 400 },
    );
  }

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await connectDB();
  const complaint = await Complaint.findOne({
    registrationNumber,
  })
    .select(`trackOtp trackOtpExpiry trackOtpAttempts ${COMPLAINT_PROJECTION}`)
    .lean();

  if (
    !complaint ||
    !complaint.trackOtp ||
    isOtpExpired(complaint.trackOtpExpiry)
  ) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 401 },
    );
  }

  if ((complaint.trackOtpAttempts ?? 0) >= otpMaxAttempts()) {
    await Complaint.updateOne(
      { _id: complaint._id },
      {
        $set: {
          trackOtp: null,
          trackOtpExpiry: null,
          trackOtpAttempts: 0,
        },
      },
    );
    return NextResponse.json(
      { error: "Too many attempts. Please request a new code." },
      { status: 429 },
    );
  }

  const expected = hashOtp(otp, registrationNumber);
  const matches = constantTimeEqual(expected, complaint.trackOtp);

  if (!matches) {
    await Complaint.updateOne(
      { _id: complaint._id },
      { $inc: { trackOtpAttempts: 1 } },
    );
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 401 },
    );
  }

  await Complaint.updateOne(
    { _id: complaint._id },
    {
      $set: {
        trackOtp: null,
        trackOtpExpiry: null,
        trackOtpAttempts: 0,
        trackOtpRequestedAt: null,
      },
    },
  );

  const {
    trackOtp,
    trackOtpExpiry,
    trackOtpAttempts,
    trackOtpRequestedAt,
    ...rest
  } = complaint;
  void trackOtp;
  void trackOtpExpiry;
  void trackOtpAttempts;
  void trackOtpRequestedAt;

  return NextResponse.json({ complaint: rest });
}
