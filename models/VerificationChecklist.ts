import mongoose, { Schema, models, model } from "mongoose";

const ChecklistItemSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    completedAt: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true } // each item gets its own ID
);

const VerificationChecklistSchema = new Schema(
  {
    animal: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
      unique: true, // one checklist per animal
    },

    items: [ChecklistItemSchema],

    overallStatus: {
      type: String,
      enum: ["INCOMPLETE", "IN_REVIEW", "VERIFIED"],
      default: "INCOMPLETE",
    },
  },
  { timestamps: true }
);

const VerificationChecklist =
  models.VerificationChecklist ||
  model("VerificationChecklist", VerificationChecklistSchema);

export default VerificationChecklist;