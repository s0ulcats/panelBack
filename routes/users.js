const express = require('express');
const { deleteUser, getAllUsers, getUserById, saveToken, updateAccountData } = require('../controllers/users.js');
const User = require('../models/User.js');
const Action = require('../models/Action.js');
const { getActionsByUser } = require('../controllers/action.js');
const Token = require('../models/Token.js');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateAccountData);
router.post('/save-token', saveToken);
router.get('/:username/actions', getActionsByUser);
router.post('/save-action', async (req, res) => {
  const { idt, action, username } = req.body;

  if (!idt || !action || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAction = new Action({
      idt,
      action,
      username,
    });

    await newAction.save();
    res.json({ message: "Action saved successfully!" });
  } catch (error) {
    console.error("Error saving action:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.delete('/:id', deleteUser);
router.post('/check-token', async (req, res) => {
  const { idt } = req.body;

  if (!idt) {
    return res.status(400).json({ message: "Токен отсутствует" });
  }

  try {
    const user = await User.findOne({ 'blockedIdts': idt });

    if (user) {
      return res.json({ exists: true, isBlocked: true });
    } else {
      return res.json({ exists: false, isBlocked: false });
    }
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    res.status(500).json({ message: "Произошла ошибка" });
  }
});
router.get('/get-token', async (req, res) => {
  try {
      const token = await Token.findOne().sort({ createdAt: -1 }); // Получаем последний токен
      if (!token) {
          return res.status(404).json({ error: 'Token not found' });
      }
      res.json({ idt: token.idt, action: token.action });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching token' });
  }
});

module.exports = router;