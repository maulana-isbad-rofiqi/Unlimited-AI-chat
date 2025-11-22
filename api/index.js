const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Izinkan akses dari mana saja
app.use(cors());
app.use(express.json());

// Target Server Gratisan
const TARGET_URL = "https://app.unlimitedai.chat/api";

// Header Palsu (Biar dikira browser asli)
const SPOOF_HEADERS = {
    'Origin': 'https://app.unlimitedai.chat',
    'Referer': 'https://app.unlimitedai.chat/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json'
};

// 1. Endpoint Ambil Token
app.get('/api/token', async (req, res) => {
    try {
        const response = await axios.get(`${TARGET_URL}/token`, { headers: SPOOF_HEADERS });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Gagal ambil token gratis" });
    }
});

// 2. Endpoint Kirim Chat
app.post('/api/chat', async (req, res) => {
    try {
        // Ambil token dari header request frontend
        const token = req.headers['x-api-token'];
        
        const response = await axios.post(`${TARGET_URL}/chat`, req.body, {
            headers: {
                ...SPOOF_HEADERS,
                'x-api-token': token
            }
        });
        
        // Kirim balik jawaban mentah ke frontend
        res.send(response.data);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal kirim pesan" });
    }
});

// Default Route
app.get('/', (req, res) => res.send("Server Proxy Gratis Aktif!"));

module.exports = app;
