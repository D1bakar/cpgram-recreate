import mongoose from "mongoose";

const STATUSES = ["Received", "Under Review", "Resolved", "Rejected"];

const complaintSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    details: { type: String, required: true },
    attachments: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        originalName: { type: String, default: "" },
        contentType: { type: String, default: "" },
        resourceType: { type: String, default: "" },
        bytes: { type: Number, default: 0 },
      },
    ],
    status: { type: String, default: "Received", enum: STATUSES },
    history: [
      {
        status: { type: String, required: true },
        note: { type: String, default: "" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const COMPLAINT_STATUSES = STATUSES;

export const Complaint =
  mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
