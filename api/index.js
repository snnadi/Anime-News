import express from 'express';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const parser = new Parser();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

async function fetchRSS(url) {
  const feed = await parser.parseURL(url);
  return feed.items.map(item => {
    const enc = item.enclosure?.url;
    const img = enc || (item.content?.match(/<img.*?src="(.*?)"/)?.[1]) || '';
    return {
      title: item.title,
      link: item.link,
      image: img,
      pubDate: item.pubDate
    };
  });
}

app.get('/api/featured', async (req, res) => {
  const items = await fetchRSS('https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us');
  res.json(items.slice(0, 4));
});

app.get('/api/popular', async (req, res) => {
  const items = await fetchRSS('https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us');
  res.json(items.slice(0, 5));
});

app.get('/api/news', async (req, res) => {
  let items = await fetchRSS('https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us');
  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q));
  }
  const page  = parseInt(req.query.page) || 1;
  const size  = 5;
  const total = Math.ceil(items.length / size);
  res.json({
    items: items.slice((page - 1) * size, page * size),
    total
  });
});

app.get('/api/reviews', async (req, res) => {
  let items = (await fetchRSS('https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us'))
    .filter(i => i.link.includes('/review/'));
  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q));
  }
  const page  = parseInt(req.query.page) || 1;
  const size  = 5;
  const total = Math.ceil(items.length / size);
  res.json({
    items: items.slice((page - 1) * size, page * size),
    total
  });
});

app.get('/api/seasonal', async (req, res) => {
  const r = await fetch('https://api.jikan.moe/v4/seasons/now');
  const { data } = await r.json();
  res.json(data.slice(0, 6));
});

app.post('/api/questions', async (req, res) => {
  const { title, email, description } = req.body;
  const { data, error } = await supabase
    .from('questions')
    .insert([{ title, email, description }])
    .select();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data[0]);
});

app.get('/api/questions', async (req, res) => {
  const { data, error } = await supabase.from('questions').select();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Listening at http://localhost:${PORT}`);
});
