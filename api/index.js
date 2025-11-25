const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Utama (GET)
app.get('/api/chat', async (req, res) => {
    const { message, model } = req.query;

    if (!message) {
        return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    // Default ke gpt5 jika tidak ada model yang dipilih
    const selectedModel = model || 'gpt5';

    try {
        let resultText = '';
        let citations = [];

        if (selectedModel === 'gpt5') {
            // --- MESIN 1: GPT-5 ---
            const targetUrl = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(message)}&model=gpt-5`;
            const response = await axios.get(targetUrl);
            if (!response.data || !response.data.status) throw new Error('GPT-5 Error');
            
            resultText = response.data.result.text;
            citations = response.data.result.citations || [];

        } else if (selectedModel === 'chatbot') {
            // --- MESIN 2: CHATBOT (Zelap) ---
            const targetUrl = `https://zelapioffciall.koyeb.app/ai/chatbot?text=${encodeURIComponent(message)}`;
            const response = await axios.get(targetUrl);
            if (!response.data || !response.data.status) throw new Error('Chatbot Error');

            resultText = response.data.answer || 'Tidak ada jawaban.';

        } else if (selectedModel === 'claila') {
            // --- MESIN 3: CLAILA (Zelap) ---
            const targetUrl = `https://zelapioffciall.koyeb.app/ai/claila?text=${encodeURIComponent(message)}`;
            const response = await axios.get(targetUrl);
            if (!response.data || !response.data.status) throw new Error('Claila Error');

            resultText = response.data.result || 'Tidak ada respons.';
        }

        // Format standar JSON untuk Frontend Kebis AI
        res.status(200).json({
            status: true,
            result: {
                text: resultText,
                citations: citations
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Gagal memproses di mesin ${selectedModel}` });
    }
});

app.get('/', (req, res) => res.send("Server Kebis AI (Multi-Engine) Aktif!"));

module.exports = app;
