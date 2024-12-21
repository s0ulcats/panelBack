const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const isUsed = await User.findOne({ username });

        if (isUsed) {
            return res.status(402).send({ message: 'This username is already in use' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
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
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

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
};

const getMe = async (req, res) => {
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
        return res.status(500).send({ message: "Not access" });
    }
};

module.exports = { register, login, getMe };