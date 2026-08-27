import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { renderEmailHtml, sendEmail } from "@/lib/email";
import { Complaint } from "@/lib/models/Complaint";
import { canResend, generateOtp, hashOtp, otpTtlMs } from "@/lib/otp";

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

  if (!isValidRegistration(registrationNumber)) {
    return NextResponse.json(
      { error: "Invalid registration number" },
      { status: 400 },
    );
  }

  await connectDB();
  const complaint = await Complaint.findOne({
    registrationNumber,
  }).select("email fullName trackOtpRequestedAt");

  if (complaint) {
    if (!canResend(complaint.trackOtpRequestedAt)) {
      return NextResponse.json(
        {
          error: "Please wait a moment before requesting another code.",
        },
        { status: 429 },
      );
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + otpTtlMs());

    complaint.trackOtp = hashOtp(otp, registrationNumber);
    complaint.trackOtpExpiry = expiry;
    complaint.trackOtpAttempts = 0;
    complaint.trackOtpRequestedAt = new Date();
    await complaint.save();

    try {
      await sendEmail({
        to: complaint.email,
        subject: "Your CPGRAMS verification code",
        text: [
          `Dear ${complaint.fullName},`,
          "",
          "A request was made to view the status of your grievance. To protect your information, please use the verification code below.",
          "",
          `Your verification code is: ${otp}`,
          "This code is valid for 10 minutes and can only be used once.",
          "",
          "If you did not request this, you can ignore this email — no one can see your complaint without this code.",
          "",
          "Regards,",
          "CPGRAMS Team",
        ].join("\n"),
        html: renderEmailHtml({
          preheader: "Your CPGRAMS verification code",
          heading: "Verification code",
          greeting: `Dear ${complaint.fullName},`,
          message:
            "A request was made to view the status of your grievance. To protect your information, enter the code below. It is valid for 10 minutes and can only be used once.",
          fields: [["Verification code", otp]],
          footerNote:
            "If you did not request this, you can ignore this email — no one can see your complaint without this code.",
        }),
      });
    } catch (emailError) {
      console.error("Failed to send tracking OTP email:", emailError);
    }
  }

  return NextResponse.json({ ok: true });
}
