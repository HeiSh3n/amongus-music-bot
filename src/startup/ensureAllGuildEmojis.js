import ensureEmojis from './ensureEmojis.js';
 
export default async function ensureAllGuildEmojis(client) {
  for (const guild of client.guilds.cache.values()) {
    await ensureEmojis(guild);
  }
} 