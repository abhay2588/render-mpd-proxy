import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Base upstream URL
const upstreamBase = 'https://linearjitp-playback.astro.com.my/dash-wv/linear/';

app.get('*', async (req, res) => {
  try {
    // Either use query ?get= or the path itself
    let path = req.query.get || req.path.substring(1); // remove leading /

    if (!path) {
      res.status(400).send('No MPD path specified');
      return;
    }

    const upstreamUrl = upstreamBase + path;

    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });

    if (!upstream.ok) {
      res.status(upstream.status).send('Upstream error');
      return;
    }

    // Set correct content type
    const headers = { 'Content-Type': upstreamUrl.endsWith('.mpd') ? 'application/dash+xml' : 'video/iso.segment' };
    res.set(headers);

    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fetch failed: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
