const Action = require('../models/Action');

const getActionsByUser = async (req, res) => {
  const { username } = req.params;

  try {
    const actions = await Action.find({ username }).sort({ createdAt: -1 }); // Сортировка по убыванию времени
    res.json(actions);
  } catch (error) {
    console.error("Ошибка при получении действий пользователя:", error);
    res.status(500).json({ message: "Произошла ошибка при получении действий" });
  }
};

module.exports = { getActionsByUser };
