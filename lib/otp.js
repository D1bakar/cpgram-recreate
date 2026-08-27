import crypto from "node:crypto";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const OTP_MAX_ATTEMPTS = 5;

function getOtpSecret() {
  return (
    process.env.OTP_SECRET || "dev-insecure-otp-secret-change-in-production"
  );
}

export function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(otp, registrationNumber) {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${otp}|${registrationNumber}`)
    .digest("hex");
}

export function isOtpExpired(expiry) {
  if (!expiry) return true;
  return new Date(expiry).getTime() < Date.now();
}

export function canResend(requestedAt) {
  if (!requestedAt) return true;
  return Date.now() - new Date(requestedAt).getTime() >= OTP_RESEND_COOLDOWN_MS;
}

export function otpTtlMs() {
  return OTP_TTL_MS;
}

export function otpMaxAttempts() {
  return OTP_MAX_ATTEMPTS;
}

export function constantTimeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
