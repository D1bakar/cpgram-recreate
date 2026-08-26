import nodemailer from "nodemailer";

function env(name) {
  return String(process.env[name] ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

export async function sendComplaintRegisteredEmail({
  to,
  fullName,
  registrationNumber,
}) {
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  const from = env("EMAIL_FROM") || user;
  const port = Number(env("SMTP_PORT") || 587);
  const appUrl = env("APP_URL") || "http://localhost:3000";

  if (!host || !user || !pass || !to) return;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const trackUrl = `${appUrl.replace(/\/$/, "")}/en/track?ref=${encodeURIComponent(registrationNumber)}`;

  await transporter.sendMail({
    from,
    to,
    subject: `CPGRAMS complaint registered: ${registrationNumber}`,
    text: [
      `Hello ${fullName},`,
      "",
      "Your grievance has been registered.",
      `Reference number: ${registrationNumber}`,
      "",
      `Track it here: ${trackUrl}`,
      "",
      "Keep this number safe. You will need it to check status.",
    ].join("\n"),
  });
}
