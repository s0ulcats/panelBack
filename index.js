const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const https = require('https');  // Подключаем модуль для работы с HTTPS
const fs = require('fs');        // Для чтения сертификатов
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;
const DB_USER = 'tbeteam229';
const DB_PASSWORD = 'yQ4fnXTcCUr4x40J';
const DB_NAME = 'tbepanel';

// Чтение SSL сертификатов
const privateKey = fs.readFileSync('/etc/letsencrypt/live/your-domain.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/your-domain.com/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.ciwlq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        );
        console.log('Connected to DB');

        // Запуск HTTPS сервера
        https.createServer(credentials, app).listen(PORT, () => {
            console.log(`Server started on https://localhost:${PORT}`);
        });
    } catch (error) {
        console.log('DB connection error:', error);
        process.exit(1);
    }
}

start();
