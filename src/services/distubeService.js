import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import fs from 'fs';
import path from 'path';

// context7: Load YouTube cookies from cookies.json for YtDlpPlugin
let youtubeCookie = '';
try {
  // Try project root, then config directory
  let cookiePath = path.join(process.cwd(), 'cookies.json');
  if (!fs.existsSync(cookiePath)) {
    cookiePath = path.join(process.cwd(), 'src', 'config', 'cookies.json');
  }
  if (fs.existsSync(cookiePath)) {
    const cookiesData = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
    // context7: Accept either a string or an array of cookie objects
    if (typeof cookiesData === 'string') {
      youtubeCookie = cookiesData;
    } else if (Array.isArray(cookiesData)) {
      // Convert array of cookie objects to cookie string
      youtubeCookie = cookiesData.map(c => `${c.name}=${c.value}`).join('; ');
    } else if (cookiesData.cookie) {
      youtubeCookie = cookiesData.cookie;
    }
  }
} catch (err) {
  console.warn('context7: Could not load YouTube cookies from cookies.json:', err.message);
}

export function createDisTube(client) {
  return new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [
      new SpotifyPlugin(),
      new SoundCloudPlugin(),
      // context7: Pass cookies to YtDlpPlugin
      new YtDlpPlugin(
        youtubeCookie
          ? { cookies: youtubeCookie }
          : {}
      ),
    ],
  });
} 