import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

app.use(express.json());

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// API to get state
app.get('/api/state', (req, res) => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf8');
      return res.json(JSON.parse(data));
    }
    return res.json({ default: true });
  } catch (err) {
    console.error('Error reading state:', err);
    res.status(500).json({ error: 'Failed to read state' });
  }
});

// API to save state
app.post('/api/state', (req, res) => {
  try {
    const state = req.body;
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving state:', err);
    res.status(500).json({ error: 'Failed to save state' });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Elden Training backend listening on port ${PORT}`);
});
