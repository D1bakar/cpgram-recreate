export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export function isAllowedAttachment(file) {
  const type = String(file?.type ?? "");
  const size = Number(file?.size ?? 0);
  return (
    ALLOWED_ATTACHMENT_TYPES.has(type) &&
    size > 0 &&
    size <= MAX_ATTACHMENT_BYTES
  );
}

export function isImageAttachment(attachment) {
  const type = String(attachment?.contentType ?? "");
  const resource = String(attachment?.resourceType ?? "");
  return type.startsWith("image/") || resource === "image";
}
