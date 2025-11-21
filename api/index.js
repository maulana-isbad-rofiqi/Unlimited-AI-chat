// api/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const TARGET_URL = "https://app.unlimitedai.chat/api";
const SPOOF_HEADERS = {
    'Origin': 'https://app.unlimitedai.chat',
    'Referer': 'https://app.unlimitedai.chat/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

app.get('/api/token', async (req, res) => {
    try {
        const response = await axios.get(`${TARGET_URL}/token`, { headers: SPOOF_HEADERS });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const token = req.headers['x-api-token'];
        const response = await axios.post(`${TARGET_URL}/chat`, req.body, {
            headers: { ...SPOOF_HEADERS, 'x-api-token': token }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => res.send("Backend Unlimited AI Aktif!"));

module.exports = app;
