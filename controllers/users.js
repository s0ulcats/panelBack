import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    if (!users.length) {
      return res.status(404).json({ message: 'Users not exist' });
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Something is wrong' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.send({ message: 'Something is wrong' });
  }
};

export const updateAccountData = async (req, res) => {
  try {
    const { idt, action } = req.body;

    if (!idt) {
      return res.status(400).json({ message: 'Токен отсутствует' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.ids.push({ idt, timestamp: new Date() });
    await user.save();

    res.json({ success: true, message: `Токен ${idt} сохранён` });
  } catch (error) {
    console.error('Ошибка обновления данных:', error);
    res.status(500).json({ message: 'Произошла ошибка' });
  }
};

export const saveToken = async (req, res) => {
  const { idt } = req.body;

  if (!idt) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    let user = await User.findOne({ ids: { $elemMatch: { idt } } });

    if (!user) {
      user = new User({
        username: "default", // Or set dynamically based on the incoming request
        password: "default", // Or set dynamically based on the incoming request
        ids: [{ idt, timestamp: new Date() }],
      });
      await user.save();
    } else {
      user.ids.push({ idt, timestamp: new Date() });
      await user.save();
    }

    // Block the token to prevent reuse
    await User.updateOne(
      { 'ids.idt': idt },
      { $addToSet: { blockedIdts: idt } }
    );

    return res.json({ success: true, message: `Token ${idt} added and blocked` });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Проверяем, что пользователь существует
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Удаляем пользователя
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};