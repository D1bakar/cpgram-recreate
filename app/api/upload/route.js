import { NextResponse } from "next/server";

import {
  ALLOWED_MEDIA_TYPES,
  isAllowedMediaType,
  MAX_MEDIA_BYTES,
  uploadMedia,
} from "@/lib/media";

export const runtime = "nodejs";

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!isAllowedMediaType(file.type) || !ALLOWED_MEDIA_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Upload an image (png, jpg, webp, gif, etc.).",
      },
      { status: 415 },
    );
  }

  if (file.size > MAX_MEDIA_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 10 MB." },
      { status: 413 },
    );
  }

  try {
    const media = await uploadMedia(file);
    return NextResponse.json({ media }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not upload file. Please try again." },
      { status: 500 },
    );
  }
}
