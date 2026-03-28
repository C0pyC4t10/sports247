require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/SPORTS247/public'));

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const CHAT_MODEL = process.env.CHAT_MODEL || 'big-pickle';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function chatWithAI(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'user', content: message }],
      max_tokens: 100,
    });
    return { source: 'openrouter', response: completion.choices[0].message.content };
  } catch (error) {
    throw new Error(`OpenRouter error: ${error.message}`);
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/SPORTS247/public/index.html');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const result = await chatWithAI(message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});