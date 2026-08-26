import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/tiff",
]);

const EXT_BY_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/tiff": "tiff",
};

export function isAllowedMediaType(type) {
  return ALLOWED_MEDIA_TYPES.has(String(type ?? "").toLowerCase());
}

function uploadToCloudinary(buffer, folder) {
  const cld = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

async function uploadToLocal(buffer, originalName) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const ext = EXT_BY_TYPE[originalName.type] ?? "bin";
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/${filename}`, publicId: null };
}

export async function uploadMedia(file, folder = "cpgrams") {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(buffer, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      name: file.name,
      bytes: result.bytes,
      type: file.type,
    };
  }
  const result = await uploadToLocal(buffer, file);
  return {
    url: result.url,
    publicId: result.publicId,
    name: file.name,
    bytes: buffer.length,
    type: file.type,
  };
}
