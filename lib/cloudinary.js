import { v2 as cloudinary } from "cloudinary";

let configured = false;

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

export async function uploadComplaintFile(file) {
  configureCloudinary();

  const bytes = Buffer.from(await file.arrayBuffer());
  const originalName = String(file.name || "document").slice(0, 180);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cpgrams",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, uploaded) => {
        if (error) reject(error);
        else resolve(uploaded);
      },
    );
    stream.end(bytes);
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    originalName,
    contentType: file.type || result.resource_type,
    resourceType: result.resource_type,
    bytes: result.bytes ?? file.size,
  };
}
