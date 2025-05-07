import { readFile } from 'fs/promises';
import path from 'path';
import { areEmojisAdded, setEmojisAdded } from '../services/emojiDatabase.js';
import { ActivityType, PermissionsBitField } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('AMONG US!');
    setBotActivity(client);
    for (const guild of client.guilds.cache.values()) {
      await ensureEmojis(guild);
    }
  },
};

function setBotActivity(client) {
  const activities = [
    { name: 'AMONGUS!', type: ActivityType.Playing },
    { name: 'AMONGUS!', type: ActivityType.Watching },
    { name: 'AMONGUS!', type: ActivityType.Listening },
    { name: 'AMONGUS!', type: ActivityType.Competing },
  ];
  let i = 0;
  function updateActivity() {
    const activity = activities[i % activities.length];
    client.user.setActivity(activity.name, { type: activity.type });
    i++;
  }
  updateActivity();
  setInterval(updateActivity, 10 * 60 * 1000);
}

async function ensureEmojis(guild) {
  const botMember = guild.members.me;
  if (await areEmojisAdded(guild.id)) {
    console.log(`Emojis already added for guild: ${guild.name}`);
    return;
  }
  if (!botMember.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
    console.log(`Bot does not have permission to manage emojis in guild: ${guild.name}`);
    return;
  }
  const emojiLimits = { 0: 50, 1: 100, 2: 150, 3: 250 };
  const maxEmojis = emojiLimits[guild.premiumTier] || 50;
  const currentEmojiCount = guild.emojis.cache.size;
  try {
    if (currentEmojiCount >= maxEmojis) {
      console.log(`Guild ${guild.name} has reached the maximum emoji limit (${currentEmojiCount}/${maxEmojis}). Cannot add new emojis.`);
      return;
    }
    let spotifyEmojiAdded = false;
    let youtubeEmojiAdded = false;
    let netEaseEmojiAdded = false;
    const existingSpotifyEmoji = guild.emojis.cache.find(e => e.name === 'Spotify');
    const existingYouTubeEmoji = guild.emojis.cache.find(e => e.name === 'YouTube');
    const existingNetEaseEmoji = guild.emojis.cache.find(e => e.name === 'NetEase');
    if (!existingSpotifyEmoji) {
      const spotifyEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'Spotify.png');
      await guild.emojis.create({
        attachment: await readFile(spotifyEmojiPath),
        name: 'Spotify',
      });
      console.log(`Added Spotify emoji to guild: ${guild.name}`);
      spotifyEmojiAdded = true;
    }
    if (!existingYouTubeEmoji) {
      const youtubeEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'Youtube.png');
      await guild.emojis.create({
        attachment: await readFile(youtubeEmojiPath),
        name: 'YouTube',
      });
      console.log(`Added YouTube emoji to guild: ${guild.name}`);
      youtubeEmojiAdded = true;
    }
    if (!existingNetEaseEmoji) {
      const netEaseEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'NetEase_Music.png');
      await guild.emojis.create({
        attachment: await readFile(netEaseEmojiPath),
        name: 'NetEase',
      });
      console.log(`Added NetEase Music emoji to guild: ${guild.name}`);
      netEaseEmojiAdded = true;
    }
    await setEmojisAdded(guild.id, spotifyEmojiAdded, youtubeEmojiAdded, netEaseEmojiAdded);
  } catch (error) {
    console.error(`Failed to add emojis to guild: ${guild.name}`, error);
  }
} 