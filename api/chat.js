import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';  // Ganti dari sebelumnya

const models = {
  'gpt-4o': openai('gpt-4o'),
  'gpt-4o-mini': openai('gpt-4o-mini'),
  'claude-3-5-sonnet': anthropic('claude-3-5-sonnet-20241022'),
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { messages, id, selectedChatModel, selectedCharacter, selectedStory } = req.body;
    const authToken = req.headers['x-api-token'];

    if (authToken !== (process.env.API_TOKEN || 'test-token-12345')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const model = models[selectedChatModel] || openai('gpt-4o');

    try {
      const { text } = await generateText({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.parts[0].text })),
      });

      const escapedText = text.replace(/"/g, '\\"');
      res.send(`0:"${escapedText}"`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
