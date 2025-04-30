const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 10000;

// === Настройки Telegram ===
const TELEGRAM_TOKEN = '7605499569:AAFgZHwE0DbXyCzQzFHGiS-Fogiw6_YrQfw';
const CHAT_ID = '885250652';

const bot = new TelegramBot(TELEGRAM_TOKEN);

// === Настройки загрузки файлов ===
const upload = multer({ dest: 'uploads/' });

// === Обслуживание index.html ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === Загрузка изображения и отправка в Telegram ===
app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;

  bot.sendPhoto(CHAT_ID, fs.createReadStream(filePath), {
    caption: 'Картинка загружена через форму',
  }).then(() => {
    fs.unlinkSync(filePath); // удалить временный файл
    res.send('Картинка отправлена в Telegram!');
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Ошибка отправки в Telegram');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
