const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    idt: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Action', ActionSchema);
