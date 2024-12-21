const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
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

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log('DB connection error:', error);
        process.exit(1);
    }
}

start();
