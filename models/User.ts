import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "STAFF", "VOLUNTEER"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedAnimals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Animal",
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;