
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const TELEGRAM_TOKEN = '7605499569:AAFgZHwE0DbXyCzQzFHGiS-Fogiw6_YrQfw';
const CHAT_ID = '885250652';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/send', async (req, res) => {
  const { imageUrl, caption } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' });
  }

  try {
    const telegramResponse = await axios.post(TELEGRAM_API, {
      chat_id: CHAT_ID,
      photo: imageUrl,
      caption: caption || '',
    });

    res.status(200).json({ success: true, result: telegramResponse.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send image', details: error.response?.data });
  }
});

app.get('/', (req, res) => {
  res.send('Telegram Image Sender is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
