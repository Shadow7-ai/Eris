// server.js - proxy and simple memory store for Eris
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const MEM_FILE = path.join(__dirname, 'memories.json');

app.use(express.json());
// Serve static files from the repo root so index.html at project root is served
app.use(express.static(path.join(__dirname)));

async function loadMemories() {
  try {
    const data = await fs.readFile(MEM_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await saveMemories([]);
      return [];
    }
    console.error('Error loading memories:', err);
    return [];
  }
}

async function saveMemories(mems) {
  await fs.writeFile(MEM_FILE, JSON.stringify(mems, null, 2), 'utf8');
}

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Memories endpoints
app.get('/api/memories', async (req, res) => {
  const mems = await loadMemories();
  res.json({ memories: mems });
});

app.post('/api/memories', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing text' });
  const mems = await loadMemories();
  const item = { id: Date.now().toString(), text, createdAt: new Date().toISOString() };
  mems.push(item);
  await saveMemories(mems);
  res.json({ memory: item });
});

app.delete('/api/memories/:id', async (req, res) => {
  const id = req.params.id;
  const mems = await loadMemories();
  const filtered = mems.filter(m => m.id !== id);
  await saveMemories(filtered);
  res.json({ ok: true });
});

// Summarize text using OpenAI (optional)
app.post('/api/memories/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });

  try {
    const messages = [
      { role: 'system', content: 'Eres un asistente que resume texto en una o dos frases en español, manteniendo la información importante.' },
      { role: 'user', content: `Resume el siguiente texto de forma concisa (1-2 frases):\n\n${text}` }
    ];

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4', messages, max_tokens: 150, temperature: 0.6 })
    });

    if (!apiRes.ok) {
      const t = await apiRes.text();
      return res.status(apiRes.status).json({ error: t });
    }
    const data = await apiRes.json();
    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ summary: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Chat proxy: accepts userMessage, history (array), memories (from client), systemPrompt
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, history = [], memories = [], systemPrompt = '' } = req.body;
    if (!userMessage) return res.status(400).json({ error: 'Missing userMessage' });

    // Load server-side memories and combine with client memories (client can send local ones too)
    const serverMems = await loadMemories();

    const memoryText = (serverMems.length > 0 ? `Memorias importantes (servidor):\n- ${serverMems.map(m => m.text).join('\n- ')}\n\n` : '') +
                       (memories && memories.length ? `Memorias locales del usuario:\n- ${memories.map(m => (m.text||m)).join('\n- ')}\n\n` : '');

    const system = (systemPrompt || 'Eris: asistente conversacional en español.').trim();

    const messages = [ { role: 'system', content: `${system}\n\n${memoryText}Responde en español de forma natural y empática.` } ];

    // Append history (assumed array of {role, content})
    for (const h of history) {
      if (h && h.role && h.content) messages.push({ role: h.role, content: h.content });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server' });

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4', messages, max_tokens: 900, temperature: 0.8 })
    });

    if (!apiRes.ok) {
      const t = await apiRes.text();
      return res.status(apiRes.status).json({ error: t });
    }

    const data = await apiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? '';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Eris server listening on http://localhost:${port}`);
});
