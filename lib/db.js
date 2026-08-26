import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

let cached = globalThis._mongooseCache;

if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const user = process.env.MONGODB_USER?.trim();
    const pass = process.env.MONGODB_PASSWORD;
    const connectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };
    if (user && pass) {
      connectOptions.user = user;
      connectOptions.pass = pass;
      connectOptions.authSource = "admin";
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, connectOptions)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
