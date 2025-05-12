import pool from './mariadbPool.js';

// Ensure the guild_emojis table exists on module load
async function ensureEmojiTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS guild_emojis (
        guild_id VARCHAR(32) PRIMARY KEY,
        spotify_emoji_added TINYINT(1) NOT NULL DEFAULT 0,
        youtube_emoji_added TINYINT(1) NOT NULL DEFAULT 0,
        netease_emoji_added TINYINT(1) NOT NULL DEFAULT 0
      )
    `);
  } catch (err) {
    console.error('DB error in ensureEmojiTable:', err);
  } finally {
    if (conn) conn.release();
  }
}
ensureEmojiTable();

export async function areEmojisAdded(guildId) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM guild_emojis WHERE guild_id = ?', [guildId]);
    if (!rows[0]) return false;
    return rows[0].spotify_emoji_added && rows[0].youtube_emoji_added && rows[0].netease_emoji_added;
  } finally {
    if (conn) conn.release();
  }
}

export async function setEmojisAdded(guildId, spotify, youtube, netease) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO guild_emojis (guild_id, spotify_emoji_added, youtube_emoji_added, netease_emoji_added)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         spotify_emoji_added = VALUES(spotify_emoji_added),
         youtube_emoji_added = VALUES(youtube_emoji_added),
         netease_emoji_added = VALUES(netease_emoji_added)`,
      [guildId, spotify ? 1 : 0, youtube ? 1 : 0, netease ? 1 : 0]
    );
  } finally {
    if (conn) conn.release();
  }
}

export { pool };
