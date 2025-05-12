import { readFile } from 'fs/promises';
import path from 'path';
import { setEmojisAdded } from '../database/adapter.js';

export default {
  name: 'guildCreate',
  once: false,
  async execute(guild, client) {
    console.log(`Joined a new guild: ${guild.name}`);
    await ensureEmojis(guild);
  },
};

// Function to ensure emojis are added to the server
async function ensureEmojis(guild) {
  const existingSpotifyEmoji = guild.emojis.cache.find(e => e.name === 'Spotify');
  const existingYouTubeEmoji = guild.emojis.cache.find(e => e.name === 'YouTube');
  const existingNetEaseEmoji = guild.emojis.cache.find(e => e.name === 'NetEase');
  let spotifyAdded = !!existingSpotifyEmoji;
  let youtubeAdded = !!existingYouTubeEmoji;
  let neteaseAdded = !!existingNetEaseEmoji;
  try {
    if (!spotifyAdded) {
      const spotifyEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'Spotify.png');
      await guild.emojis.create({
        attachment: await readFile(spotifyEmojiPath),
        name: 'Spotify',
      });
      console.log(`Added Spotify emoji to guild: ${guild.name}`);
      spotifyAdded = true;
    }
    if (!youtubeAdded) {
      const youtubeEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'Youtube.png');
      await guild.emojis.create({
        attachment: await readFile(youtubeEmojiPath),
        name: 'YouTube',
      });
      console.log(`Added YouTube emoji to guild: ${guild.name}`);
      youtubeAdded = true;
    }
    if (!neteaseAdded) {
      const netEaseEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'NetEase_Music.png');
      await guild.emojis.create({
        attachment: await readFile(netEaseEmojiPath),
        name: 'NetEase',
      });
      console.log(`Added NetEase Music emoji to guild: ${guild.name}`);
      neteaseAdded = true;
    }
    // Update DB with emoji status
    await setEmojisAdded(guild.id, spotifyAdded, youtubeAdded, neteaseAdded);
  } catch (error) {
    console.error(`Failed to add emojis to guild: ${guild.name}`, error);
  }
} 