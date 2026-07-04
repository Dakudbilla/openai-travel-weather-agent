import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PORT } from './config.js';
import { askAboutCity } from './agent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Serve the static frontend from /public.
app.use(express.static(join(__dirname, '..', 'public')));

// API: ask the agent about a city.
app.post('/api/ask', async (req, res) => {
  const city = (req.body?.city || '').trim();

  if (!city) {
    return res.status(400).json({ error: 'Please provide a city name.' });
  }

  try {
    const answer = await askAboutCity(city);
    res.json({ city, answer });
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({ error: 'Something went wrong while contacting the agent.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌍 Travel & Weather Guide running at http://localhost:${PORT}\n`);
});
