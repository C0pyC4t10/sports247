require('dotenv').config();
const OpenAI = require('openai');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const CHAT_MODEL = process.env.CHAT_MODEL || 'llama3.2';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function testOllama() {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: 'Hello, can you confirm this connection works? Reply in one sentence.',
      stream: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Ollama error: ${response.status}`);
  }

  return data.response;
}

async function testOpenRouter() {
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'user', content: 'Hello, can you confirm this connection works?' }
    ],
  });

  return completion.choices[0].message.content;
}

async function testConnection() {
  try {
    console.log('Trying Ollama...');
    const response = await testOllama();
    console.log('Ollama Response:', response);
  } catch (ollamaError) {
    console.error('Ollama failed:', ollamaError.message);
    console.log('Falling back to OpenRouter...');
    try {
      const response = await testOpenRouter();
      console.log('OpenRouter Response:', response);
    } catch (openRouterError) {
      console.error('OpenRouter failed:', openRouterError.message);
    }
  }
}

testConnection();
