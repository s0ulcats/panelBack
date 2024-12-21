import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import Token from '../models/Token.js';

const router = new Router();

router.post('/register', register);
router.post('/login', login);
router.post('/me', checkAuth, getMe);
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
});router.post('/save-action', async (req, res) => {
  const { idt, action, username } = req.body;

  if (!idt || !action || !username) {
    return res.status(400).json({ error: 'idt, action и username обязательны' });
  }

  try {
    // Обновляем токен, сохраняем время действия и пользователя
    const token = await Token.findOneAndUpdate(
      { idt },
      { action, deleted: true, username, updatedAt: new Date() },  // Время обновления
      { new: true, upsert: true }
    );

    // Отправляем данные на PHP сервер (если требуется)
    const response = await fetch('http://localhost/cn/err', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idt, action, username }),  // Отправляем данные
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
router.get('/users/:username/tokens', async (req, res) => {
  const { username } = req.params;
  try {
      // Получаем токены для пользователя из базы данных
      const tokens = await Token.find({ username }).exec();
      if (!tokens) {
          return res.status(404).json({ message: "Token logs not found" });
      }
      res.json(tokens);
  } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ message: "Error fetching token logs" });
  }
});
export default router;