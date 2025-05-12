import pool from './pool.js';

// Table creation logic (run on module load)
async function ensureEmojiTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guild_emojis (
        guild_id VARCHAR(32) PRIMARY KEY,
        spotify_emoji_added BOOLEAN NOT NULL DEFAULT FALSE,
        youtube_emoji_added BOOLEAN NOT NULL DEFAULT FALSE,
        netease_emoji_added BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
  } catch (err) {
    console.error('DB error in ensureEmojiTable:', err);
  }
}
if (pool) ensureEmojiTable();

export async function areEmojisAdded(guildId) {
  const res = await pool.query('SELECT * FROM guild_emojis WHERE guild_id = $1', [guildId]);
  if (!res.rows[0]) return false;
  return res.rows[0].spotify_emoji_added && res.rows[0].youtube_emoji_added && res.rows[0].netease_emoji_added;
}

export async function setEmojisAdded(guildId, spotify, youtube, netease) {
  await pool.query(
    `INSERT INTO guild_emojis (guild_id, spotify_emoji_added, youtube_emoji_added, netease_emoji_added)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (guild_id) DO UPDATE SET
       spotify_emoji_added = EXCLUDED.spotify_emoji_added,
       youtube_emoji_added = EXCLUDED.youtube_emoji_added,
       netease_emoji_added = EXCLUDED.netease_emoji_added`,
    [guildId, spotify ? 1 : 0, youtube ? 1 : 0, netease ? 1 : 0]
  );
} 