import mongoose, { Schema, models, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["MEDICAL", "INTAKE", "ADOPTION", "OTHER"],
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    relatedAnimal: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Document = models.Document || model("Document", DocumentSchema);

export default Document;