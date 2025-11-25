const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Utama (GET)
app.get('/api/chat', async (req, res) => {
    const { message } = req.query;

    if (!message) {
        return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    try {
        // Menggunakan API GPT-5
        const targetUrl = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(message)}&model=gpt-5`;
        
        const response = await axios.get(targetUrl);
        
        // Cek jika API error
        if (!response.data || !response.data.status) {
            throw new Error('API External Error');
        }

        // Kirim data utuh ke frontend
        res.status(200).json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil respon dari Mesin GPT-5' });
    }
});

app.get('/', (req, res) => res.send("Server Kebis AI (GPT-5 Engine) Aktif!"));

module.exports = app;
