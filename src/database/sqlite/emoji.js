import db from './pool.js';

await db.exec(`
  CREATE TABLE IF NOT EXISTS guild_emojis (
    guild_id TEXT PRIMARY KEY,
    spotify_emoji_added INTEGER NOT NULL DEFAULT 0,
    youtube_emoji_added INTEGER NOT NULL DEFAULT 0,
    netease_emoji_added INTEGER NOT NULL DEFAULT 0
  )
`);

export async function areEmojisAdded(guildId) {
  const row = await db.get('SELECT * FROM guild_emojis WHERE guild_id = ?', guildId);
  if (!row) return false;
  return row.spotify_emoji_added && row.youtube_emoji_added && row.netease_emoji_added;
}

export async function setEmojisAdded(guildId, spotify, youtube, netease) {
  await db.run(
    `INSERT INTO guild_emojis (guild_id, spotify_emoji_added, youtube_emoji_added, netease_emoji_added)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(guild_id) DO UPDATE SET
       spotify_emoji_added = excluded.spotify_emoji_added,
       youtube_emoji_added = excluded.youtube_emoji_added,
       netease_emoji_added = excluded.netease_emoji_added`,
    guildId, spotify ? 1 : 0, youtube ? 1 : 0, netease ? 1 : 0
  );
} 