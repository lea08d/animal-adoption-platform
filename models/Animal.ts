import mongoose, { Schema, models, model } from "mongoose";

const AnimalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },
    ageUnit: {
      type: String,
      enum: ["months", "years"],
      required: true,
    },

    sex: {
      type: String,
      trim: true,
    },
    intakeSource: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ["INCOMPLETE", "IN_REVIEW", "VERIFIED"],
      default: "INCOMPLETE",
    },
    assignedVolunteers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    checklist: {
      type: Schema.Types.ObjectId,
      ref: "VerificationChecklist",
    },
  },
  { timestamps: true }
);

const Animal = models.Animal || model("Animal", AnimalSchema);

export default Animal;