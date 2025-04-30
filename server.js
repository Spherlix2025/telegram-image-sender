const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 10000;

// Настройки multer для загрузки файлов
const upload = multer({ dest: 'uploads/' });

// Главная страница (форма)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Обработка формы
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const filePath = req.file.path;
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', fs.createReadStream(filePath));
    formData.append('caption', 'Загружено через HTML-форму');

    await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(filePath); // удалить файл после отправки
    res.send('<h2 style="color:white; background:#111; padding:20px;">Изображение успешно отправлено в Telegram!</h2>');
  } catch (error) {
    res.status(500).send('Ошибка отправки изображения: ' + error.message);
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
