const express = require('express');
const Steam = require('../models/Steam.js');
const crypto = require('crypto');
const { getSteamProfileByToken } = require('../controllers/steamController.js');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, name, description, level, ava, decor, bg_img, bg_webm, bg_mp4 } = req.body;

  try {
    const token = crypto.randomBytes(16).toString('hex'); // Генерация случайного токена

    const newSteam = new Steam({
      username,
      name,
      description,
      level,
      avatar_url: ava,
      decor_url: decor,
      background_img_url: bg_img,
      background_webm_url: bg_webm,
      background_mp4_url: bg_mp4,
      token,
    });

    const savedSteam = await newSteam.save();
    res.status(201).json({ savedSteam, link: `http://145.223.23.122:3001/api/steam/${token}` }); // Возвращаем ссылку с токеном
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.get('/', async (req, res) => {
    try {
      const steamData = await Steam.find(); // Получаем все записи из базы данных
      res.status(200).json(steamData); // Отправляем данные клиенту
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

  router.get('/:token', getSteamProfileByToken);

  

module.exports = router;
