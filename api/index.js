const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Utama (GET)
app.get('/api/chat', async (req, res) => {
    const { message, model, image } = req.query; // Tambah parameter image

    if (!message) {
        return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    // Default model
    const selectedModel = model || 'gpt5';
    const imageUrl = image || ''; // Default kosong jika tidak ada gambar

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

        } else if (selectedModel === 'deepseek-think') {
            // --- 4. DEEPSEEK THINK (Reasoning) ---
            const targetUrl = `https://api.ootaizumi.web.id/ai/deepseek-think?messages=${encodeURIComponent(message)}`;
            const response = await axios.get(targetUrl);
            resultText = response.data.result || response.data.data || JSON.stringify(response.data);

        } else if (selectedModel === 'veo3') {
            // --- 5. VEO3 (AI VIDEO) ---
            // Menggunakan prompt dan imageUrl
            const targetUrl = `https://api.ootaizumi.web.id/ai-video/veo3?prompt=${encodeURIComponent(message)}&imageUrl=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(targetUrl);
            
            // Biasa return url video atau status
            const data = response.data;
            if (typeof data === 'string') {
                resultText = data;
            } else if (data.url || data.result) {
                resultText = `Video berhasil dibuat: \n${data.url || data.result}`;
            } else {
                resultText = JSON.stringify(data);
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
        res.status(500).json({ error: `Gagal memproses di mesin ${selectedModel}. Server sedang sibuk.` });
    }
});

app.get('/', (req, res) => res.send("Server Kebis AI (Multi-Engine + Veo3) Aktif!"));

module.exports = app;
