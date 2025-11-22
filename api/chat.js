import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { messages, selectedChatModel } = req.body;
    const authToken = req.headers['x-api-token'];

    // Validasi Token (Pastikan API_TOKEN diset di Vercel)
    if (authToken !== (process.env.API_TOKEN || 'test-token-12345')) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }

    // Pemilihan Model
    let model;
    if (selectedChatModel === 'claude-3-5-sonnet') {
        model = anthropic('claude-3-5-sonnet-20240620');
    } else if (selectedChatModel === 'gpt-4o-mini') {
        model = openai('gpt-4o-mini');
    } else {
        model = openai('gpt-4o');
    }

    // Konversi format pesan untuk AI SDK
    // Pastikan struktur messages sesuai dengan yang dikirim frontend
    const coreMessages = messages.map(m => ({
      role: m.role,
      content: m.parts && m.parts[0] ? m.parts[0].text : m.content
    }));

    const { text } = await generateText({
      model,
      messages: coreMessages,
    });

    // Format output sesuai permintaan frontend lama (0:"text")
    // Escape double quotes agar JSON valid saat di-parse frontend
    const escapedText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return res.status(200).send(`0:"${escapedText}"`);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: error.message || 'Internal Server Error',
      details: error.toString()
    });
  }
}
