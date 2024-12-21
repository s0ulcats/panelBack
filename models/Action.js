import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    idt: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Action", ActionSchema);
