const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const steamRoute = require('./routes/steam.js');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;
const DB_USER = 'tbeteam229';
const DB_PASSWORD = 'yQ4fnXTcCUr4x40J';
const DB_NAME = 'tbepanel';

app.use('/api/steam/img', express.static(path.join(__dirname, 'controllers', 'img')));
app.use('/api/steam/css', express.static(path.join(__dirname, 'controllers', 'css')));
app.use('/api/steam', express.static(path.join(__dirname, 'controllers')));


// Настройка CORS
app.use(cors({
  origin: 'http://145.223.23.122:3000',  // Разрешаем запросы только с этого источника
  methods: ['GET', 'POST', 'OPTIONS'],  // Разрешаем методы
  allowedHeaders: ['Content-Type', 'Authorization'],  // Разрешаем нужные заголовки
  credentials: true, // Если нужно отправлять cookies или аутентификационные данные
}));

// Для обработки предзапросов OPTIONS
app.options('*', cors());

app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/steam', steamRoute);
app.get('/test', (req, res) => {
    res.send('Nginx is working!');
});


async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.ciwlq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        );
        console.log('Connected to DB');

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log('DB connection error:', error);
        process.exit(1);
    }
}

start();