import pool from './pool.js';

await pool.query(`
  CREATE TABLE IF NOT EXISTS guild_prefixes (
    guild_id VARCHAR(32) PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL
  )
`);

export async function getPrefix(guildId) {
  const [rows] = await pool.query('SELECT prefix FROM guild_prefixes WHERE guild_id = ?', [guildId]);
  return rows[0]?.prefix || null;
}

export async function setPrefix(guildId, prefix) {
  await pool.query(
    'INSERT INTO guild_prefixes (guild_id, prefix) VALUES (?, ?) ON DUPLICATE KEY UPDATE prefix = VALUES(prefix)',
    [guildId, prefix]
  );
} 