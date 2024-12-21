import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    ids: [{ idt: String, timestamp: Date }],
    blockedIdts: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
