const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { register, login, getMe } = require('../controllers/auth.js'); // Функции register, login и getMe должны быть импортированы
const { checkAuth } = require('../utils/checkAuth.js');
const Token = require('../models/Token.js');
const fetch = require('node-fetch');
const User = require('../models/User.js');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
      const { username, phone, password } = req.body;

      const isUsed = await User.findOne({ phone });

      if (isUsed) {
          return res.status(402).send({ message: 'This phone number is already in use' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({
          phone,
          username,
          password: hash,
      });

      const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
      );

      await newUser.save();

      return res.send({
          newUser,
          token,
          message: "Registration successful",
      });

  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error while creating user" });
  }
})

router.post('/login', async (req, res) => {
  try {
      const { username, phone, password } = req.body;
      const user = await User.findOne({ phone });

      if (!user) {
          return res.status(404).send({ message: "User doesn't exist" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
          return res.status(401).send({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
      );

      return res.send({
          token,
          user,
          message: "Login successful",
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error with authentication" });
  }
})

router.post('/me', (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.userId = decoded.id;
          next();
      } catch (error) {
          console.error('Token verification error:', error);
          return res.status(403).send({ message: 'No access' });
      }
  } else {
      console.warn('No token provided');
      return res.status(403).send({ message: 'No access' });
  }
}, async (req, res) => {
  try {
      const user = await User.findById(req.userId);

      if (!user) {
          return res.send({ message: "User doesn't exist" });
      }

      const token = jwt.sign(
          {
              id: user._id
          },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
      );

      return res.send({
          user,
          token
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({message: "Not access"});
  }
})
router.get('/users/:username/tokens', async (req, res) => {
  const { username } = req.params;
  
  try {
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Здесь можно добавить логику получения токенов для пользователя
      const tokens = await Token.find({ username: user.username });

      res.json({ tokens });
  } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ message: "Error fetching tokens" });
  }
});
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

    const response = await fetch('https://wanmei-go5v5.pro/cn/err', {
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