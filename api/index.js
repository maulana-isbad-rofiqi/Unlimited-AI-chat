const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Utama (GET)
app.get('/api/chat', async (req, res) => {
    const { message, model, image } = req.query;

    if (!message) {
        return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    // Default model
    const selectedModel = model || 'gpt5';
    const imageUrl = image || '';

    try {
        let resultText = '';
        let citations = [];

        if (selectedModel === 'gpt5') {
            // --- 1. COPILOT AI (GPT-5) ---
            const targetUrl = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(message)}&model=gpt-5`;
            const response = await axios.get(targetUrl);
            if (!response.data || !response.data.status) throw new Error('Copilot Error');
            resultText = response.data.result.text;
            citations = response.data.result.citations || [];

        } else if (selectedModel === 'chatbot') {
            // --- 2. DEEPSEEK (Standard) ---
            const targetUrl = `https://zelapioffciall.koyeb.app/ai/chatbot?text=${encodeURIComponent(message)}`;
            const response = await axios.get(targetUrl);
            resultText = response.data.answer || 'Tidak ada jawaban.';

        } else if (selectedModel === 'claila') {
            // --- 3. CLAILA ---
            const targetUrl = `https://zelapioffciall.koyeb.app/ai/claila?text=${encodeURIComponent(message)}`;
            const response = await axios.get(targetUrl);
            resultText = response.data.result || 'Tidak ada respons.';

        } else if (selectedModel === 'gptnano') {
            // --- 4. GPT NANO (TETAP ADA) ---
            const targetUrl = `https://api.ootaizumi.web.id/ai/gptnano?prompt=${encodeURIComponent(message)}&imageUrl=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(targetUrl);
            resultText = response.data.result || response.data.data || "Tidak ada hasil.";

        } else if (selectedModel === 'veo3') {
            // --- 5. VEO3 (AI VIDEO) - MENGGANTIKAN DEEPSEEK THINK ---
            const targetUrl = `https://api.ootaizumi.web.id/ai-video/veo3?prompt=${encodeURIComponent(message)}&imageUrl=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(targetUrl);
            
            // Handle response veo3
            const data = response.data;
            if (data.url || (typeof data === 'string' && data.startsWith('http'))) {
                resultText = data.url || data; // Ambil URL video
            } else {
                resultText = JSON.stringify(data); // Jika error/format lain
            }
        }

        // Kirim balik ke frontend
        res.status(200).json({
            status: true,
            result: {
                text: resultText,
                citations: citations
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Gagal memproses di mesin ${selectedModel}.` });
    }
});

app.get('/', (req, res) => res.send("Server Kebis AI (Veo3 Update) Aktif!"));

module.exports = app;
