import mongoose from "mongoose";

const AnimalNoteSchema = new mongoose.Schema(
  {
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["BEHAVIOR", "FOSTER", "INTERNAL"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AnimalNote ||
  mongoose.model("AnimalNote", AnimalNoteSchema);