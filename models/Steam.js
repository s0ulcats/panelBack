const mongoose = require('mongoose');

const SteamSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    avatar_url: { type: String, required: true },
    decor_url: { type: String, required: true },
    background_img_url: { type: String, required: true },
    background_webm_url: { type: String, required: true },
    background_mp4_url: { type: String, required: true },
    token: { type: String, required: true, unique: true }, // Уникальный токен
  },
  { timestamps: true }
);

module.exports = mongoose.model('Steam', SteamSchema);
