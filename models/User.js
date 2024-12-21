const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    ids: [{ idt: String, timestamp: Date }],
    blockedIdts: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
