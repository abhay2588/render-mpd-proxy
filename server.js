import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 Replace with your real MPD URL
const mpdUrl = 'https://linearjitp-playback.astro.com.my/dash-wv/linear/2504/default_primary.mpd';

app.get('/', async (req, res) => {
  try {
    const upstream = await fetch(mpdUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });

    if (!upstream.ok) {
      res.status(upstream.status).send('Upstream error');
      return;
    }

    res.set('Content-Type', 'application/dash+xml');
    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fetch failed: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
