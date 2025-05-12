import { readFile } from 'fs/promises';
import path from 'path';
import { areEmojisAdded, setEmojisAdded } from '../database/adapter.js';
import { PermissionsBitField } from 'discord.js';
import { logger } from '../utils/logger.js';

export default async function ensureEmojis(guild) {
  const botMember = guild.members.me;
  if (await areEmojisAdded(guild.id)) {
    logger.info(`Emojis already added for guild: ${guild.name}`);
    return;
  }
  if (!botMember.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
    logger.info(`Bot does not have permission to manage emojis in guild: ${guild.name}`);
    return;
  }
  const emojiLimits = { 0: 50, 1: 100, 2: 150, 3: 250 };
  const maxEmojis = emojiLimits[guild.premiumTier] || 50;
  const currentEmojiCount = guild.emojis.cache.size;
  try {
    if (currentEmojiCount >= maxEmojis) {
      logger.info(`Guild ${guild.name} has reached the maximum emoji limit (${currentEmojiCount}/${maxEmojis}). Cannot add new emojis.`);
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
      logger.info(`Added Spotify emoji to guild: ${guild.name}`);
      spotifyEmojiAdded = true;
    }
    if (!existingYouTubeEmoji) {
      const youtubeEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'Youtube.png');
      await guild.emojis.create({
        attachment: await readFile(youtubeEmojiPath),
        name: 'YouTube',
      });
      logger.info(`Added YouTube emoji to guild: ${guild.name}`);
      youtubeEmojiAdded = true;
    }
    if (!existingNetEaseEmoji) {
      const netEaseEmojiPath = path.join(process.cwd(), 'src', 'emoji', 'NetEase_Music.png');
      await guild.emojis.create({
        attachment: await readFile(netEaseEmojiPath),
        name: 'NetEase',
      });
      logger.info(`Added NetEase Music emoji to guild: ${guild.name}`);
      netEaseEmojiAdded = true;
    }
    await setEmojisAdded(guild.id, spotifyEmojiAdded, youtubeEmojiAdded, netEaseEmojiAdded);
  } catch (error) {
    logger.error(`Failed to add emojis to guild: ${guild.name}`, error);
  }
} 