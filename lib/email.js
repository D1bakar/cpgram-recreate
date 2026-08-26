import { appendFile } from "node:fs/promises";
import nodemailer from "nodemailer";

function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

let cachedTransport = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;
  if (isEmailConfigured()) {
    cachedTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    cachedTransport = {
      async sendMail(message) {
        const log = [
          "\n[email:dev-mode] (not sent — configure SMTP_* to deliver)",
          `  to:      ${Array.isArray(message.to) ? message.to.join(", ") : message.to}`,
          `  subject: ${message.subject}`,
          "  text:",
          message.text,
          "",
        ].join("\n");
        console.log(log);
        try {
          await appendFile(`${process.cwd()}/email-dev.log`, `${log}\n`);
        } catch {
          /* ignore */
        }
        return { dev: true, messageId: `dev-${Date.now()}` };
      },
    };
  }
  return cachedTransport;
}

export function getFromAddress() {
  return (
    process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@cpgrams.gov.in"
  );
}

export async function sendEmail({ to, subject, text, html, cc, bcc }) {
  const transport = getTransport();
  return transport.sendMail({
    from: getFromAddress(),
    to,
    cc,
    bcc,
    subject,
    text,
    html: html || text,
  });
}

export async function sendBulk(messages) {
  return Promise.allSettled(
    messages.map((message) =>
      sendEmail(message).catch((error) => ({ error: String(error) })),
    ),
  );
}
export function renderEmailHtml({
  preheader = "",
  heading,
  greeting,
  message,
  fields = [],
  badge,
  cta,
  footerNote,
}) {
  const fontStack =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const fieldRows = fields
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;font-family:${fontStack};font-size:14px;line-height:20px;color:#505a5f;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-family:${fontStack};font-size:14px;line-height:20px;color:#0b0c0c;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const badgeHtml = badge
    ? (() => {
        const colors = STATUS_COLORS[badge] || STATUS_COLORS.Received;
        return `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${colors.bg};color:${colors.fg};border:1px solid ${colors.border};font-family:${fontStack};font-size:13px;font-weight:700;">${escapeHtml(badge)}</span>`;
      })()
    : "";

  const ctaHtml = cta
    ? `<a href="${escapeHtml(cta.href)}" style="display:inline-block;margin-top:22px;padding:13px 22px;background:#1d70b8;color:#ffffff;text-decoration:none;border-radius:8px;font-family:${fontStack};font-size:15px;font-weight:700;">${escapeHtml(cta.text)}</a>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(heading || "CPGRAMS")}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f2f1;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2f1;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#1d70b8;padding:22px 28px;">
                <div style="font-family:${fontStack};font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">CPGRAMS</div>
                <div style="font-family:${fontStack};font-size:12px;color:#cfe2f3;margin-top:2px;">Government Public Grievance Redressal System</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 6px;font-family:${fontStack};font-size:22px;line-height:28px;color:#0b0c0c;font-weight:800;">${escapeHtml(heading)}</h1>
                ${badgeHtml ? `<div style="margin:0 0 16px;">${badgeHtml}</div>` : ""}
                ${greeting ? `<p style="margin:0 0 10px;font-family:${fontStack};font-size:15px;line-height:22px;color:#0b0c0c;">${escapeHtml(greeting)}</p>` : ""}
                ${message ? `<p style="margin:0 0 18px;font-family:${fontStack};font-size:15px;line-height:22px;color:#1f2a30;">${escapeHtml(message)}</p>` : ""}
                ${
                  fieldRows
                    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin-bottom:8px;">${fieldRows}</table>`
                    : ""
                }
                ${ctaHtml}
                ${
                  footerNote
                    ? `<p style="margin:24px 0 0;font-family:${fontStack};font-size:12px;line-height:18px;color:#6b7280;">${escapeHtml(footerNote)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="background:#f3f2f1;padding:16px 28px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-family:${fontStack};font-size:12px;line-height:18px;color:#6b7280;">This is an automated message from CPGRAMS. Please do not reply to this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

const STATUS_COLORS = {
  Received: { bg: "#f3f2f1", fg: "#0b0c0c", border: "#b1b4b6" },
  "Under Review": { bg: "#dbeafe", fg: "#1d4ed8", border: "#bfdbfe" },
  Resolved: { bg: "#dcfce7", fg: "#15803d", border: "#bbf7d0" },
  Rejected: { bg: "#fee2e2", fg: "#b91c1c", border: "#fecaca" },
};
