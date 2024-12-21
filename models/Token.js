const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    idt: { type: String, required: true, unique: true },
    action: { type: String, required: true },
    username: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    actionTimestamp: { type: Date, default: Date.now }, // Время действия
  },
  { timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
