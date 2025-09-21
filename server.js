import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Base upstream URL
const upstreamBase = 'https://linearjitp-playback.astro.com.my/dash-wv/linear/';

// Default MPD path
const defaultMPD = 'channel123/manifest.mpd';

app.get('*', async (req, res) => {
  try {
    // Use ?get= parameter or path, fallback to default
    const path = req.query.get || req.path.substring(1) || defaultMPD;
    const upstreamUrl = upstreamBase + path;

    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });

    if (!upstream.ok) {
      res.status(upstream.status).send('Upstream error');
      return;
    }

    res.set('Content-Type', upstreamUrl.endsWith('.mpd') ? 'application/dash+xml' : 'video/iso.segment');
    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fetch failed: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
