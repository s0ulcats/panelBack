const express = require('express');
const { register, login, getMe } = require('../controllers/auth.js'); // Функции register, login и getMe должны быть импортированы
const { checkAuth } = require('../utils/checkAuth.js');
const Token = require('../models/Token.js');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/register',register); // Здесь register должно быть функцией
router.post('/login', login); // Здесь login должно быть функцией
router.post('/me', async (req, res) => checkAuth, getMe); // Функция checkAuth и getMe

// Убедитесь, что остальные маршруты используют правильные функции
router.get('/get-token', async (req, res) => {
  try {
    const token = await Token.findOne().sort({ createdAt: -1 }).exec();
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    res.json({ idt: token.idt, action: token.action, deleted: token.deleted });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/save-token', async (req, res) => {
  const { idt, action } = req.body;

  if (!idt || !action) {
    return res.status(400).json({ error: 'idt и action обязательны' });
  }

  try {
    const token = await Token.findOneAndUpdate(
      { idt },
      { action },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Токен сохранен или обновлен', token });
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/save-action', async (req, res) => {
  const { idt, action, username } = req.body;

  if (!idt || !action || !username) {
    return res.status(400).json({ error: 'idt, action и username обязательны' });
  }

  try {
    const token = await Token.findOneAndUpdate(
      { idt },
      { action, deleted: true, username, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    const response = await fetch('http://localhost/cn/err', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idt, action, username }),
    });

    const phpResponse = await response.json();

    res.json({
      success: true,
      message: 'Действие сохранено, помечено как удаленное, и отправлено на PHP сервер',
      token,
      phpResponse,
    });
  } catch (error) {
    console.error('Ошибка сохранения действия:', error);
    res.status(500).json({ error: 'Не удалось сохранить действие' });
  }
});

module.exports = router;